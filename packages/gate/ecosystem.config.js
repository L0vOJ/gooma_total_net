module.exports = {
  apps : [
  {
      name: 'total_gate',
      script: '../../node_modules/@keystone-6/core/bin/cli.js', // 애플리케이션의 진입점 파일명
      args: 'start',
      exec_mode: 'cluster',
      wait_ready: true,
      listen_timeout: 10000,
      // instances: 1, // 실행할 프로세스의 인스턴스 수
      // autorestart: true, // 애플리케이션의 자동 재시작 여부
      // watch: true, // 파일 변경 감지 및 재시작 여부
      max_memory_restart: '1G', // 메모리 사용량을 기준으로 재시작하는 설정
      env: { // 환경 변수
        // TOKEN: 'token',
        //PASSWORD: 'password'
      	"NODE_ENV": "production",
        "DNS_HOST": "netgooma.ddns.net",
        "GATE_DB": "mysql",
        // "SESSION_SECRET": "",
        // "GATE_DB": "sqlite",
      }
    },
  ],
};
