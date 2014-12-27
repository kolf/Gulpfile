var gulp = require('gulp'),
	watch = require('gulp-watch'),
	plumber = require('gulp-plumber'),
	notify = require("gulp-notify"),
	uncss = require('gulp-uncss'),
	minify = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	jade = require("gulp-jade"),
    coffee = require('gulp-coffee'),
	stylus = require('gulp-stylus'),
	imagemin = require("gulp-imagemin"),
	pngquant = require('imagemin-pngquant'),
	spritesmith = require("gulp.spritesmith"),
	browserSync = require('browser-sync');
/*
# ===============================================
# Компиляция Jade в HTML
# ===============================================
*/
gulp.task('jade', function () {
  gulp.src('../src/templates/index.jade')
	.pipe(plumber())
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('../public'))
	.pipe(browserSync.reload({stream: true}))
	.pipe(notify("Jade Compiled"));
});		
/*
# ===============================================
# Компиляция Stylus в CSS
# ===============================================
*/	
gulp.task('stylus', function () {
  gulp.src('../src/stylus/main.styl')
	.pipe(plumber())
    .pipe(stylus())
    .pipe(gulp.dest('../public/css'))
	.pipe(browserSync.reload({stream: true}))
	.pipe(notify("Stylus Compiled"));
});
/*    
# ===============================================
# Компиляция Coffee в JavaScript
# ===============================================
*/
gulp.task('coffee', function() {
  	gulp.src('../src/coffee/*.coffee')
		.pipe(plumber()) 
	    .pipe(coffee())
	    .pipe(gulp.dest('../public/js'))
		.pipe(browserSync.reload({stream: true}))
		.pipe(notify("Coffee Compiled"));
});
/*
# ===============================================
# Перезагрузка страницы
# ===============================================
*/
gulp.task("browser-sync", function() {
    browserSync.init(["css/*.css", "js/*.js","*.html"], {
      server: {
        baseDir: "../public/"
      }
    });
  });
/*
# ===============================================
# Сжатие картинок
# ===============================================
*/
gulp.task('imgmin', function () {
    return gulp.src('../src/img-out/*.png')
		.pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('../public/images/design'))
		.pipe(notify("Images optimized"));
});  
/*    
# ==============================================================
# !!!Самостоятельно запускаемые таски!!!
# ==============================================================
*/
/*    
# ===============================================
# Спрайты 
# ===============================================
*/
gulp.task('sprites', function() {
    var spriteData = 
        gulp.src('../src/sprites/*.*')     // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: '_sprite.styl',
                imgPath: '/images/design/sprite.png',//Путь прописаный в CSS как Background-image
                cssFormat: 'stylus',
                cssTemplate: 'stylus.template.mustache',
                padding: 4,
                algorithm: 'binary-tree',
                cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name
                }
            }));

    spriteData.img.pipe(gulp.dest('../src/img-out')); // путь, куда сохраняем картинку
	spriteData.css.pipe(gulp.dest('../src/stylus')); // путь, куда сохраняем стили
});
/*    
# ===============================================
# Убираем лишний код CSS
# ===============================================
*/
gulp.task('uncss', function() {
    return gulp.src('../public/css/main.css')
        .pipe(uncss({
            html: ['../public/index.html']
        }))
        .pipe(minify())
		.pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('../public/css'));
    ;
});
/*
# ===============================================
# Отслеживание изменения файлов
# ===============================================
*/
gulp.task('watch', function() {
	gulp.watch('../src/templates/**/*.jade', ['jade']);
	gulp.watch('../src/stylus/**/*.styl', ['stylus']);		
	gulp.watch('../src/coffee/**/*.coffee', ['coffee']);
	gulp.watch('../src/img-out/*.png', ['imgmin']);
  
});

gulp.task('default', ['imgmin','jade','stylus','coffee','browser-sync','watch']);