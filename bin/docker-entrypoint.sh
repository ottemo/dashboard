#!/bin/sh

echo "generate dashboard config and start it"
echo "you have to define at least ENV, APIURL and MEDIAPATH parameters"
echo "USESTRICT and ITEMSPERPAGE are optional parametes"

if ! [ -n "$ENV" ] ; then
  echo "you have to define ENV environment parameter. Can be set to stage or prod"
  exit 2
fi
if ! [ -n "$APIURL" ] ; then
  echo "you have to define APIURL environment parameter"
  exit 2
fi
if ! [ -n "$MEDIAPATH" ] ; then
  echo "you have to define MEDIAPATH environment parameter"
  exit 2
fi
if [ -n "$MEDIAFOLDER" ] ; then
  ln -s $MEDIAFOLDER /home/ottemo/media
fi

ITEMSPERPAGE="${ITEMSPERPAGE:-15}"

cat << EOF > config/current.json
{
    "useStrict"    : "$USESTRICT",
    "apiUrl"       : "$APIURL",
    "mediaPath"    : "$MEDIAPATH",
    "itemsPerPage" : "$ITEMSPERPAGE"
}
EOF

echo "use follow dashboard config:"
cat config/current.json

/usr/local/bin/gulp serve --env=$ENV --config=current
