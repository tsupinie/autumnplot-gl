
rm -rf lib/*
npx -p typescript tsc --declaration --outDir lib --target es2020 --sourceMap false --allowJs false 
cp -r src/glsl lib/.

for file in `ls lib/*.js`
do
    cp $file /tmp/file.js
    default_IFS=$IFS
    IFS=$'\n'

    # Bring in JSON files
    for imp in `grep -e "import .* from .*\.json" $file`
    do
        filename=`echo $imp | sed 's/.*"\(.*\.json\)".*/\1/' | sed "s/.*'\(.*\.json\)'.*/\1/"`
        variable=`echo $imp | tr -s ' ' | sed 's/import \(.*\) from.*/\1/'`

        file_contents=`cat lib/$filename | tr '\n' ' '`
        replacement="const $variable = $file_contents"
     
        cat /tmp/file.js | sed "s|$imp|$replacement|" > /tmp/file.out.js
        mv /tmp/file.out.js /tmp/file.js
    done

    # Bring in glsl files
    for imp in `grep -e "require(.*\.glsl.*)" $file`
    do
        filename=`echo $imp | sed 's/.*"\(.*\.glsl\)".*/\1/' | sed "s/.*'\(.*\.glsl\)'.*/\1/"`
        variable=`echo $imp | tr -s ' ' | sed 's/const \(.*\) =.*/\1/' | sed 's/let \(.*\) =.*/\1/' | sed 's/var \(.*\) =.*/\1/'`
        
        file_contents=`cat lib/$filename | sed "s%//.*%%" | sed 's%&%\\\&%g' | tr '\n' '^'`
        replacement="const $variable = \`$file_contents\`"

        cat /tmp/file.js | sed "s%$imp%$replacement%" | tr '^' '\n' > /tmp/file.out.js
        mv /tmp/file.out.js /tmp/file.js
    done

    IFS=$default_IFS
    mv /tmp/file.js $file
done

rm -rf lib/glsl lib/json