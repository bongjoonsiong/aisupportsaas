import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Organization, UserRole } from '../types';
import { DEFAULT_ORG } from '../data/defaultData';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  currentOrg: Organization;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string, orgName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: (role: UserRole, orgName?: string) => void;
  logout: () => Promise<void>;
  toggleOnlineStatus: () => void;
  updateOrg: (org: Partial<Organization>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  uid: 'usr_demo_admin_1',
  email: 'alex.chen@acmecloud.io',
  displayName: 'Alex Chen',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'owner',
  orgId: 'org_acme_cloud',
  isOnline: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('omnidesk_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentOrg, setCurrentOrg] = useState<Organization>(() => {
    const savedOrg = localStorage.getItem('omnidesk_org');
    return savedOrg ? JSON.parse(savedOrg) : DEFAULT_ORG;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listen for Firebase Auth state changes and sync with Cloud Firestore
    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Attempt to retrieve profile from Firestore
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
              const loadedUser = userSnap.data() as UserProfile;
              setUser(loadedUser);
              localStorage.setItem('omnidesk_user', JSON.stringify(loadedUser));

              if (loadedUser.orgId) {
                const orgDocRef = doc(db, 'organizations', loadedUser.orgId);
                const orgSnap = await getDoc(orgDocRef);
                if (orgSnap.exists()) {
                  const loadedOrg = orgSnap.data() as Organization;
                  setCurrentOrg(loadedOrg);
                  localStorage.setItem('omnidesk_org', JSON.stringify(loadedOrg));
                }
              }
            } else {
              // Create user record in Firestore if not existing
              const newOrgId = `org_${firebaseUser.uid.slice(0, 10)}`;
              const newOrg: Organization = {
                id: newOrgId,
                name: firebaseUser.displayName ? `${firebaseUser.displayName}'s Team` : 'My Organization',
                slug: (firebaseUser.displayName || 'workspace').toLowerCase().replace(/\s+/g, '-'),
                plan: 'pro',
                createdAt: new Date().toISOString(),
                membersCount: 1,
              };
              const profile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || 'user@example.com',
                displayName: firebaseUser.displayName || (firebaseUser.email?.split('@')[0] ?? 'Agent'),
                avatarUrl: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
                role: 'owner',
                orgId: newOrgId,
                isOnline: true,
              };

              setUser(profile);
              setCurrentOrg(newOrg);
              localStorage.setItem('omnidesk_user', JSON.stringify(profile));
              localStorage.setItem('omnidesk_org', JSON.stringify(newOrg));

              // Persist to Cloud Firestore
              await setDoc(doc(db, 'organizations', newOrgId), newOrg, { merge: true });
              await setDoc(userDocRef, profile, { merge: true });
            }
          } catch (fsErr) {
            console.warn('Firestore user fetch fallback to local state:', fsErr);
            const profile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || 'user@example.com',
              displayName: firebaseUser.displayName || (firebaseUser.email?.split('@')[0] ?? 'Agent'),
              avatarUrl: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
              role: 'owner',
              orgId: currentOrg.id,
              isOnline: true,
            };
            setUser(profile);
            localStorage.setItem('omnidesk_user', JSON.stringify(profile));
          }
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase Auth listener fallback to local state', e);
    }
  }, [currentOrg.id]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      try {
        const userDocRef = doc(db, 'users', res.user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const profile = userSnap.data() as UserProfile;
          setUser(profile);
          localStorage.setItem('omnidesk_user', JSON.stringify(profile));
          if (profile.orgId) {
            const orgDoc = await getDoc(doc(db, 'organizations', profile.orgId));
            if (orgDoc.exists()) {
              const org = orgDoc.data() as Organization;
              setCurrentOrg(org);
              localStorage.setItem('omnidesk_org', JSON.stringify(org));
            }
          }
          return;
        }
      } catch (dbErr) {
        console.warn('Firestore login fetch warning:', dbErr);
      }

      const profile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || email,
        displayName: res.user.displayName || email.split('@')[0],
        avatarUrl: res.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${res.user.uid}`,
        role: 'owner',
        orgId: currentOrg.id,
        isOnline: true,
      };
      setUser(profile);
      localStorage.setItem('omnidesk_user', JSON.stringify(profile));
      setDoc(doc(db, 'users', res.user.uid), profile, { merge: true }).catch(() => {});
    } catch (error) {
      // Fallback for demo sign-in
      const demoProfile: UserProfile = {
        uid: `usr_${Date.now()}`,
        email: email,
        displayName: email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: 'owner',
        orgId: currentOrg.id,
        isOnline: true,
      };
      setUser(demoProfile);
      localStorage.setItem('omnidesk_user', JSON.stringify(demoProfile));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, pass: string, name: string, orgName: string) => {
    setIsLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const newOrgId = `org_${Date.now()}`;
      const newOrg: Organization = {
        id: newOrgId,
        name: orgName || `${name}'s Workspace`,
        slug: (orgName || name).toLowerCase().replace(/\s+/g, '-'),
        plan: 'pro',
        createdAt: new Date().toISOString(),
        membersCount: 1,
      };
      const profile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || email,
        displayName: name || email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        role: 'owner',
        orgId: newOrg.id,
        isOnline: true,
      };
      setCurrentOrg(newOrg);
      setUser(profile);
      localStorage.setItem('omnidesk_org', JSON.stringify(newOrg));
      localStorage.setItem('omnidesk_user', JSON.stringify(profile));

      // Save to Cloud Firestore
      try {
        await setDoc(doc(db, 'organizations', newOrgId), newOrg, { merge: true });
        await setDoc(doc(db, 'users', res.user.uid), profile, { merge: true });
      } catch (fsErr) {
        console.warn('Firestore signup sync warning:', fsErr);
      }
    } catch (error) {
      // Fallback local registration
      const newOrg: Organization = {
        id: `org_${Date.now()}`,
        name: orgName || `${name}'s Workspace`,
        slug: (orgName || name).toLowerCase().replace(/\s+/g, '-'),
        plan: 'pro',
        createdAt: new Date().toISOString(),
        membersCount: 1,
      };
      const profile: UserProfile = {
        uid: `usr_${Date.now()}`,
        email: email,
        displayName: name || email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        role: 'owner',
        orgId: newOrg.id,
        isOnline: true,
      };
      setCurrentOrg(newOrg);
      setUser(profile);
      localStorage.setItem('omnidesk_org', JSON.stringify(newOrg));
      localStorage.setItem('omnidesk_user', JSON.stringify(profile));
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      
      try {
        const userDocRef = doc(db, 'users', res.user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const profile = userSnap.data() as UserProfile;
          setUser(profile);
          localStorage.setItem('omnidesk_user', JSON.stringify(profile));
          if (profile.orgId) {
            const orgDoc = await getDoc(doc(db, 'organizations', profile.orgId));
            if (orgDoc.exists()) {
              const org = orgDoc.data() as Organization;
              setCurrentOrg(org);
              localStorage.setItem('omnidesk_org', JSON.stringify(org));
            }
          }
          return;
        }
      } catch (dbErr) {
        console.warn('Firestore Google login check warning:', dbErr);
      }

      const newOrgId = `org_${res.user.uid.slice(0, 10)}`;
      const newOrg: Organization = {
        id: newOrgId,
        name: `${res.user.displayName || 'Google User'}'s Team`,
        slug: (res.user.displayName || 'google').toLowerCase().replace(/\s+/g, '-'),
        plan: 'pro',
        createdAt: new Date().toISOString(),
        membersCount: 1,
      };

      const profile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || 'user@gmail.com',
        displayName: res.user.displayName || 'Google User',
        avatarUrl: res.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${res.user.uid}`,
        role: 'owner',
        orgId: newOrgId,
        isOnline: true,
      };
      setUser(profile);
      setCurrentOrg(newOrg);
      localStorage.setItem('omnidesk_user', JSON.stringify(profile));
      localStorage.setItem('omnidesk_org', JSON.stringify(newOrg));

      setDoc(doc(db, 'organizations', newOrgId), newOrg, { merge: true }).catch(() => {});
      setDoc(doc(db, 'users', res.user.uid), profile, { merge: true }).catch(() => {});
    } catch (e) {
      console.warn('Google Auth popup closed or fallback triggered', e);
      // Demo Google Profile
      const demoG: UserProfile = {
        uid: 'usr_google_demo',
        email: 'jsbong7989@gmail.com',
        displayName: 'Google Workspace Agent',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'owner',
        orgId: currentOrg.id,
        isOnline: true,
      };
      setUser(demoG);
      localStorage.setItem('omnidesk_user', JSON.stringify(demoG));
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = (role: UserRole, orgName?: string) => {
    const org: Organization = {
      id: `org_${(orgName || 'Acme Cloud').toLowerCase().replace(/\s+/g, '_')}`,
      name: orgName || 'Acme Cloud Technologies',
      slug: (orgName || 'Acme Cloud').toLowerCase().replace(/\s+/g, '-'),
      plan: 'pro',
      createdAt: '2026-01-15T08:00:00Z',
      membersCount: 4,
    };
    const profile: UserProfile = {
      uid: `usr_${role}_${Date.now()}`,
      email: role === 'owner' ? 'alex.chen@acmecloud.io' : role === 'admin' ? 'marcus.v@acmecloud.io' : 'sarah.j@acmecloud.io',
      displayName: role === 'owner' ? 'Alex Chen (Founder)' : role === 'admin' ? 'Marcus Vance (Lead)' : 'Sarah Jenkins (Support)',
      avatarUrl: role === 'owner' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: role,
      orgId: org.id,
      isOnline: true,
    };
    setCurrentOrg(org);
    setUser(profile);
    localStorage.setItem('omnidesk_org', JSON.stringify(org));
    localStorage.setItem('omnidesk_user', JSON.stringify(profile));
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (_) {}
    setUser(null);
    setCurrentOrg(DEFAULT_ORG);
    localStorage.removeItem('omnidesk_user');
    localStorage.removeItem('omnidesk_org');
  };

  const toggleOnlineStatus = () => {
    if (user) {
      const updated = { ...user, isOnline: !user.isOnline };
      setUser(updated);
      localStorage.setItem('omnidesk_user', JSON.stringify(updated));
    }
  };

  const updateOrg = (partial: Partial<Organization>) => {
    const updated = { ...currentOrg, ...partial };
    setCurrentOrg(updated);
    localStorage.setItem('omnidesk_org', JSON.stringify(updated));
    try {
      setDoc(doc(db, 'organizations', currentOrg.id), updated, { merge: true }).catch((e) => {
        console.warn('Firestore updateOrg sync warning:', e);
      });
    } catch (e) {
      console.warn('Firestore updateOrg sync warning:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentOrg,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        loginAsDemo,
        logout,
        toggleOnlineStatus,
        updateOrg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
