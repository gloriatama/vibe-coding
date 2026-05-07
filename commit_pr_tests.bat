git add .
git commit -m "feat: implement comprehensive unit tests for user APIs"
git push origin feature/unit-test
gh pr create --base main --head feature/unit-test --title "Feature: Unit Tests" --body "Implementasi unit test untuk seluruh API User menggunakan Bun Test."
