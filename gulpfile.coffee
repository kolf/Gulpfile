gulp = require("gulp")
watch = require("gulp-watch")
stylus = require("gulp-stylus")
jade = require("gulp-jade")
plumber = require("gulp-plumber")
spritesmith = require("gulp.spritesmith")
imagemin = require("gulp-imagemin")
browserSync = require("browser-sync")
minifyCSS = require('gulp-minify-css')
uncss = require('gulp-uncss')
browserSync = require("browser-sync")


# ===============================================
# Компиляция Stylus в CSS
# ===============================================

gulp.task "stylus", ->
  gulp.src("../src/stylus/main.styl")
  .pipe(plumber())
  .pipe(stylus())
  .pipe(gulp.dest("../public/css"))
  .pipe browserSync.reload(stream: true)
  return

# ===============================================
# Компиляция Jade в HTML
# ===============================================

gulp.task "jade", ->
  gulp.src("../src/templates/**/index.jade")
  .pipe(plumber())
  .pipe(jade(pretty: true))
  .pipe(gulp.dest("../public/"))
  .pipe browserSync.reload(stream: true)
  return
# ===============================================
# Перезагрузка страницы
# ===============================================

gulp.task "browser-sync", ->
  browserSync.init [
    "css/*.css"
    "js/*.js"
  ],
    server:
      baseDir: "../public/" # указываем директорию для работы

  return

# сервера browser-sync

# ===============================================
# Сжатие картинок
# ===============================================
gulp.task "imgmin", ->
  gulp.src("../src/images-output/*")
  .pipe(plumber())
  .pipe(imagemin(progressive: true))
  .pipe gulp.dest("../public/images/design")
  return
# ===============================================
# Спрайты 
# ===============================================

gulp.task "sprite", ->
  # путь, откуда берем картинки для спрайта
  spriteData = gulp.src("../src/sprite-output/*.*").pipe(spritesmith(
    imgName: "sprite.png"
    cssName: "_sprite.styl"
    imgPath: "/images/design/sprite.png" #Путь прописаный в CSS как Background-image
    cssFormat: "stylus"
    cssTemplate: "stylus.template.mustache"
    padding: 4
    algorithm: "binary-tree"
    cssVarMap: (sprite) ->
      sprite.name = "s-" + sprite.name
      return
  ))
  spriteData.img.pipe gulp.dest("../public/images/design") # путь, куда сохраняем картинку
  spriteData.css.pipe gulp.dest("../src/stylus") # путь, куда сохраняем стили
  return
# ===============================================
# Удаление ненужного CSS кода и его минификация
# ===============================================
gulp.task "uncss", ->
    return gulp.src("../public/css/main.css")
        .pipe(uncss({
            html: ['../public/index.html']
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('../public/uncss'));  
# ===============================================
# Отслеживание изменения файлов
# ===============================================

gulp.task "watch", ->
  gulp.watch "../src/stylus/**/*.styl", ["stylus"]
  gulp.watch "../src/templates/**/*.jade", ["jade"]
  gulp.watch "../src/images-output/*", ["imgmin"]

gulp.task "default", [
  "stylus"
  "jade"
  "imgmin"
  "browser-sync"
  "watch"
]