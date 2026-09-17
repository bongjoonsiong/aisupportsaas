# Cloud Run, Kubernetes, CI/CD & Deployment Workflows Note

## 2. Is Cloud Run a stateless "container" run by Google's Kubernetes automatically?

Yes, that is fundamentally what Cloud Run is.

Here is how it works under the hood:

### Stateless Container Contract
- Cloud Run requires your application to be packaged as an OCI-compliant container (a standard Docker image).
- Each container instance is stateless and ephemeral: it can start in milliseconds to handle incoming HTTP requests and shut down when there is zero traffic (scale-to-zero).
- Any durable data (user accounts, bot configurations, knowledge base articles, chat history) must be stored in external persistent services like Cloud Firestore, Cloud Storage, or a database, rather than on the container's temporary local disk.

### Run by Google's Kubernetes Automatically
- Cloud Run is built directly on Knative, an open-source serverless platform developed by Google that sits on top of Google Kubernetes Engine (GKE).
- Google completely abstracts away the Kubernetes cluster: you don't manage worker nodes, write Kubernetes pod definitions, configure ingress controllers, or patch node operating systems.
- Google automatically spins up container replicas across its fleet when incoming traffic surges and destroys idle replicas when traffic stops, handling HTTPS routing and autoscaling out of the box.

---

## 3. Is the Cloud Run / Knative / GKE the “CD” part of the CICD? My objective is to use CICD for this Daily Financial Tracking Apps with CICD, so that I can learn both Flutter, Firebase, Firestore apps development and then CICD at one go.

**They are deployment targets (infrastructure), not the CI/CD pipeline itself.**

* **CI (Continuous Integration):** The automated pipeline that runs tests, validates lint rules, and builds your code every time you push a commit (e.g., running `flutter test`, `flutter analyze`, and building the app).
* **CD (Continuous Delivery / Deployment):** The automated pipeline that takes the built, tested artifact and releases it to its target destination.
* **Where Cloud Run / GKE fit:** They are **cloud hosting environments** where backend services or web applications live. Your CD pipeline might *target* Cloud Run by running a command like `gcloud run deploy`.
* **For a Flutter mobile app:** Cloud Run is **not** where mobile apps are deployed. Your mobile CD deployment targets are the **Google Play Console** (Internal/Closed testing tracks) and **Apple TestFlight / App Store Connect**. However, if your Flutter app connects to a custom backend API or microservice, that backend often lives on Cloud Run.

---

## 4. You said GitHub action is most popular workflows in modern SW Development, but what about Cloud Run/GKE? And the workflow you mean here is CICD?

**GitHub Actions is the automation engine (pipeline); Cloud Run and GKE are the servers that run your backend workloads.**

* **GitHub Actions:** A **CI/CD orchestrator**. You write a `.github/workflows/*.yml` file that instructs GitHub:
  1. *On Git push*, spin up a clean virtual runner (Ubuntu, macOS, or Windows).
  2. Install Flutter or Docker.
  3. Run tests.
  4. Build and sign your release files.
  5. Deploy them to their destinations.
* **Cloud Run & GKE:** Managed compute platforms running Docker containers. They do not watch your code or test it; they only run the final container you hand them.
* When people talk about a **"GitHub Actions workflow"**, they are referring directly to that **automated CI/CD script**.

---

## 5. If use Cloud Run, there is no need to push the code to GitHub right? Instead push it to Cloud Build or Google Artifacts right?

**In standard software engineering, you still push to GitHub first.**

Here is the difference between where files live:
* **GitHub:** Holds your human-readable **Source Code** (`.dart`, `.ts`, `Dockerfile`, etc.) and history.
* **Google Artifact Registry:** Holds compiled **Container Images (Docker images)** or binary packages, not raw source code.
* **Google Cloud Build:** A build tool (alternative to GitHub Actions) that turns source code into container images.

### Standard Flow:
```
Developer (git push) 
  ↳ GitHub Repository
      ↳ Triggers CI/CD (GitHub Actions or Cloud Build Trigger)
          ↳ Builds container image
              ↳ Pushes image to Google Artifact Registry
                  ↳ Deploys image to Cloud Run
```

*(Note: While you can run `gcloud run deploy --source .` from your local terminal to upload local files directly to Cloud Build without Git, doing so bypasses code reviews, automated testing, and team version control, which defeats the purpose of CI/CD).*

---

## 6. The Apps we are building now is actually a mobile Apps that to be deployed on Google Play or Apple Store, why we need to use website (my domain.com/omnidesk or Omnitel.domain.com)? What is the usual practise for deploying a mobile Apps?

### Why websites/domains are involved with mobile apps:
1. **App Store & Play Store Requirements:** Both Apple and Google mandate public URLs for your app's **Privacy Policy** and **Support Page** (e.g., `https://yourdomain.com/privacy`).
2. **Deep Linking / App Links:** To allow links (e.g., `https://yourdomain.com/track/123`) to open directly inside your installed Flutter mobile app, both platforms require hosting a configuration file on your domain (`/.well-known/assetlinks.json` for Android and `/.well-known/apple-app-site-association` for iOS).
3. **Marketing & Landing Pages:** A lightweight web presence gives users a place to discover the app and click download badges for Google Play and the App Store.
4. **Admin Dashboard:** Many mobile apps have a companion web portal where administrators, support staff, or accountants manage users and view reports from a desktop browser.

### Standard Mobile CI/CD & Deployment Practice:
For a Flutter + Firebase mobile application, the industry-standard workflow looks like this:

1. **Repository:** Your code is committed to GitHub.
2. **CI Pipeline (GitHub Actions or Codemagic):**
   * Checks code formatting and runs unit/widget tests (`flutter test`).
   * Verifies Firebase security rules (`firebase-tools`).
3. **CD Pipeline (Fastlane + GitHub Actions):**
   * Decrypts signing certificates and keystores securely from repository secrets.
   * Compiles the Android App Bundle (`.aab`) and iOS Archive (`.ipa`).
   * Automatically uploads the Android build to **Google Play Console (Internal Testing track)**.
   * Automatically uploads the iOS build to **Apple TestFlight**.
4. **Release:** Testers and team members test the build directly on their physical devices. Once approved in the Google Play Console and App Store Connect, you promote the build to public production.

---

## 7. Can I conclude for a deployment with CI/CD:
1. If it is a pure WebApps, push to GCP Cloud Build, Create Container Image to Artifacts Registry, then deploy to Cloud Run. CICD: (Cloud Build).
2. If it is a mobile Apps: push to Github repo, run automated CICD Scripts through Github Actions, Flutter Test + Firebase security rules, then push the artifacts to GCP Artifacts Registry for website hosting, also push the container's image (or .aab and .ipa) to both Google Play and Apple Test Flight.

Are the workflow Correct?

### Analysis & Key Distinctions

#### 1. Pure Web App: **CORRECT**
- **Status:** Accurate.
- **Pipeline:** `Git push` ➔ `Cloud Build (CI/CD)` ➔ `Artifact Registry` ➔ `Cloud Run (Hosting)`.

#### 2. Mobile App: **Clarifications on Artifacts vs. Mobile Binaries**
1. **Mobile apps do not use container images:**
   - Google Play and Apple TestFlight **do not run Docker containers**.
   - They accept native binaries:
     - Android: `.aab` (Android App Bundle).
     - iOS: `.ipa` (iOS App Store Package).
   - Your GitHub Actions runner builds these binaries directly using Flutter (`flutter build appbundle` and `flutter build ipa`) without containerizing them.

2. **Artifact Registry is not used for mobile apps or website hosting:**
   - **Google Artifact Registry** is an internal server repository for Docker images, Maven packages, npm modules, etc. It does not serve public websites or distribute mobile apps.
   - For your **companion website / landing page / privacy policy**:
     - Either deploy static files directly to **Firebase Hosting** (`firebase deploy --only hosting`), which is free, fast, and built into Firebase.
     - Or, if you have a custom Node.js/Express server for the web app, that Docker container is pushed to Artifact Registry and hosted on Cloud Run.

---

## 8. Summary Comparison Table

| App Type | Source Control | CI/CD Engine | Built Artifact | Destination / Hosting |
| :--- | :--- | :--- | :--- | :--- |
| **Pure Web App** (Full-stack / SSR) | GitHub | **Cloud Build** (or GitHub Actions) | Docker Container Image (stored in **Artifact Registry**) | **Cloud Run** |
| **Mobile App (Android)** | GitHub | **GitHub Actions** (using `ubuntu-latest`) | `.aab` (Android App Bundle, signed) | **Google Play Console** (Internal/Closed Track) |
| **Mobile App (iOS)** | GitHub | **GitHub Actions** (using `macos-latest`) | `.ipa` (iOS Archive, signed with Apple Certs) | **Apple TestFlight** |
| **Mobile Companion Web** (Privacy policy / Deep links) | GitHub | **GitHub Actions** | Static HTML/JS/CSS | **Firebase Hosting** |
| **Backend / DB Rules** | GitHub | **GitHub Actions** | `firestore.rules` & Firebase Functions | **Firebase / Firestore** (`firebase deploy`) |

---

## 9. Recommended Single Pipeline Architecture (Flutter + Firebase + Companion Web)

```
Developer pushes code to GitHub
   │
   ├── [Job 1: Quality Checks]
   │     ├── Run flutter analyze & flutter test
   │     └── Validate firestore.rules
   │
   ├── [Job 2: Firebase Deployment]
   │     ├── Deploy firestore.rules to Firestore
   │     └── Deploy companion web pages (privacy/terms) to Firebase Hosting
   │
   ├── [Job 3: Android Release]
   │     ├── Build signed .aab with Flutter
   │     └── Upload directly to Google Play Internal Testing (via Fastlane / Google Play Action)
   │
   └── [Job 4: iOS Release]
         ├── Build signed .ipa with Flutter (on macOS runner)
         └── Upload directly to Apple TestFlight (via Fastlane / Apple App Store Action)
```
