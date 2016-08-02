
cat ../dist/xdr.js ../dist/jquery.json-2.4.js ../dist/messenger.js ../dist/charts/js/highcharts.src.js  ../dist/bootstrap-master/bootstrap/js/bootstrap.js ../dist/noty/js/noty/jquery.noty.js ../dist/noty/js/noty/layouts/absolute.js ../dist/noty/js/noty/layouts/bottomRight.js ../dist/noty/js/noty/layouts/center.js ../dist/noty/js/noty/themes/bootstrap.js ../dist/noty/js/noty/themes/default.js ../dist/jquery.cookie.js  ../dist/jquery.base64.js > ironman_depend.js

slimit -m < ironman_depend.js > ironman_depend.min.js

cp ironman_depend.min.js ../ironman/360/js

cp ironman_depend.min.js ../ironman/chrome/js