import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'cors';
import path from 'path';
import fs from 'fs';
import rfs from 'rotating-file-stream';
import routes from './routes';

const app = express();

app.use(cors());
app.enable("jsonp callback");   //jsonp 지원
//-- 로깅

const logDirectory = path.join(__dirname, 'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = rfs('access.log', {
  interval: '1d', // 매일 매일 로그 파일 생성
  path: logDirectory
})
app.use(morgan('combined', {stream: accessLogStream}))

app.set('port', (process.env.PORT || 3000));

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

routes(app);

const server = app.listen(app.get('port'), function() {
    console.log("연락처 서비스가 " + app.get('port') + "번 포트에서 시작되었습니다!");
});



