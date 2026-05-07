git add .
git commit -m "fix: add maxLength validation to user registration"
git push origin bugfix/validasi-panjang
gh pr create --base main --head bugfix/validasi-panjang --title "Fix: Name and Email length validation" --body "Implementasi validasi maxLength: 255 pada endpoint registrasi untuk mencegah error 500 dari database (Issue #13)."
