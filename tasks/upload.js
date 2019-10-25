var gulp = require('gulp');
var GulpSSH = require('gulp-ssh'); //ssh

//读取配置文件[每个人的不同,不上传svn,没有则生成一份格式]
let fs = require('fs');
let authPath = './authInfo.txt';
let authPaths = './buildEntry.txt';
let sshConfigStr = null;
let authPathsFile = null;
try {
  sshConfigStr = fs.readFileSync(authPath, 'utf-8');
  authPathsFile = fs.readFileSync(authPaths, 'utf-8');
} catch (e) {
  fs.writeFileSync(
    authPath,
    '{"host":"本地ip","port":对应端口,"username":"自己的账户","password":"账户密码"}'
  );
  var str = '{"entryData": []}';
  // var str = "exports.enterDataNameArr = function() {return []}";
  fs.writeFileSync(authPaths, str);
}
let sshConfig = JSON.parse(sshConfigStr);
var enterDataNameDir = JSON.parse(authPathsFile).entryDir;
var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: sshConfig
});

//上传js
gulp.task(
  'uploadjs',
  gulp.series(function() {
    return gulp
      .src([`./dist/js/${enterDataNameDir}/*.js`, './dist/js/*.js'])
      .pipe(gulpSSH.dest('/home/web/apache/htdocs/js/kuwolive/alone'));
  })
);

//上传css
gulp.task(
  'uploadcss',
  gulp.series(function() {
    return gulp
      .src([`./dist/css/${enterDataNameDir}/*.css`])
      .pipe(gulpSSH.dest('/home/web/apache/htdocs/css/kuwolive/alone/huodong'));
  })
);

//上传jsp
gulp.task(
  'uploadjsp',
  gulp.series(function() {
    return gulp
      .src([`./dist/${enterDataNameDir}/*.html`])
      .pipe(
        gulpSSH.dest(
          '/home/web/tomcat-8.0.41/webapps/KuwoLive/jsp/alone/huodong'
        )
      );
  })
);

//上传js、css、jsp
gulp.task(
  'upload',
  gulp.series('uploadjs', 'uploadcss', 'uploadjsp', done =>
    done(console.log('完成'))
  )
);
