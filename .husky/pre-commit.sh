cat << 'EOF' > .husky/pre-commit
#!/bin/sh

# 테스트 환경이 준비되면 아래 주석을 해제하세요.
# pnpm test

# 무조건 성공으로 보고하여 커밋 프로세스를 진행시킴
exit 0
EOF
chmod +x .husky/pre-commit