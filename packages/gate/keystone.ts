// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core'


// to keep this file tidy, we define our schema in a different file
import { lists } from './schema'

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth'

import path from 'path';
import express from 'express';

export default withAuth(
  config({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: 'sqlite',
      url: 'file:./keystone.db',
    },
    lists,
    session,
    server: {
      cors: {
        origin: ['http://localhost:3001'], // React 앱 주소
        credentials: true,
      },
      extendExpressApp: (app) => {
        // React 정적 파일 경로 설정
        // console.log(`NODE_ENV: "${process.env.NODE_ENV}"`);
        // console.log(`Comparison: ${process.env.NODE_ENV === 'production'}`);
        if (process.env.NODE_ENV === 'production') {
          console.log(process.env.NODE_ENV);
          const reactBuildPath = path.join(__dirname, 'build');
          app.use('/page', express.static(reactBuildPath));
          // 모든 비정적 요청을 React의 index.html로 리디렉션
          app.get('/page/*', (req, res) => {
            res.sendFile(path.join(reactBuildPath, 'index.html'));
            // res.send('Operate in Production Mode');
          });
        } 
        else {
          // 개발 환경에서는 React 앱의 핫 리로딩을 위해 다른 처리를 할 수 있습니다.
          app.get('/page/*', (req, res) => {
            res.send('Operate in Development Mode');
            console.log(process.env.NODE_ENV);
          });
        }
      },
    }
  })
)
