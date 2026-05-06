git add .
git commit -m "feat: implement get current user endpoint"
git push origin feature/get-current-user
gh pr create --base main --head feature/get-current-user --title "Feature: Get Current User" --body "Implementasi fitur untuk mendapatkan data user yang sedang login."
