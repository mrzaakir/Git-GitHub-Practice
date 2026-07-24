#!/usr/bin/env bash
# --------------------------------------------------------------
# create_bulk_commits.sh (no subfolders)
# --------------------------------------------------------------
# Generates 50 feature sets, each consisting of 8 source files placed in the repository root.
# --------------------------------------------------------------

# ==== SETTINGS =================================================
REPO_ROOT="$(pwd)"
GIT_USER="mrzaakir"
GIT_EMAIL="mrzaakiraj@gmail.com"

# ==== PREPARE REPO =============================================
git config user.name "$GIT_USER"
git config user.email "$GIT_EMAIL"

# ---- loop over 1..50 -----------------------------------------
for i in $(seq 1 50); do
  # ---------- Java ----------
  JAVA_PKG="package com.example.demo;"
  cat <<EOF > Feature${i}Service.java
$JAVA_PKG
// Feature $i Service
public class Feature${i}Service {
    public void execute() {
        System.out.println("Feature $i Service");
    }
}
EOF

  cat <<EOF > Feature${i}Controller.java
$JAVA_PKG
// Feature $i Controller
public class Feature${i}Controller {
    private Feature${i}Service service = new Feature${i}Service();
    public void run() {
        service.execute();
    }
}
EOF

  cat <<EOF > Feature${i}Model.java
$JAVA_PKG
// Feature $i Model
public class Feature${i}Model {
    private String name = "Feature $i";
}
EOF

  # ---------- JavaScript ----------
  cat <<EOF > feature${i}.js
// Feature $i main module
export function feature${i}(){ console.log('Feature $i'); }
EOF

  cat <<EOF > feature${i}Helper.js
// Feature $i helper
export const helper${i} = () => { return 'helper $i'; };
EOF

  cat <<EOF > feature${i}Api.js
// Feature $i API stub
export const api${i} = { get: () => Promise.resolve('data $i') };
EOF

  # ---------- TypeScript ----------
  cat <<EOF > feature${i}.ts
// Feature $i TypeScript module
export function feature${i}TS(): void { console.log('Feature $i TS'); }
EOF

  cat <<EOF > feature${i}Types.ts
// Feature $i Types
export interface Feature${i}Props { id: number; name: string; }
EOF

  # ---------- Git ----------
  git add Feature${i}Service.java \
          Feature${i}Controller.java \
          Feature${i}Model.java \
          feature${i}.js \
          feature${i}Helper.js \
          feature${i}Api.js \
          feature${i}.ts \
          feature${i}Types.ts

  git commit -m "Add Feature $i – Java service/controller/model, JS modules, TS modules"

done

# ---- push everything ----
git push origin master
