git add .
git commit -m "feat: implement user logout endpoint"
git push origin feature/logout-user
gh pr create --base main --head feature/logout-user --title "Feature: User Logout" --body "Implementasi fitur logout user sesuai spesifikasi Issue #11."
