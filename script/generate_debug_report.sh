#!/bin/bash

OUTPUT="debug_report.txt"

echo "=== DEBUG REPORT ===" > $OUTPUT
echo "" >> $OUTPUT

echo "=== 1) Arborescence complète du projet ===" >> $OUTPUT
tree -a ~/Bureau/Projet_Web >> $OUTPUT 2>/dev/null
echo "" >> $OUTPUT

echo "=== 2) Fichiers contenant 'db.js' ===" >> $OUTPUT
grep -RIn "db.js" ~/Bureau/Projet_Web >> $OUTPUT 2>/dev/null
echo "" >> $OUTPUT

echo "=== 3) Contenu des fichiers suspects ===" >> $OUTPUT

FILES=$(grep -RIl "db.js" ~/Bureau/Projet_Web)

for f in $FILES; do
    echo "--- $f ---" >> $OUTPUT
    sed -n '1,200p' "$f" >> $OUTPUT
    echo "" >> $OUTPUT
done

echo "=== FIN DU RAPPORT ===" >> $OUTPUT

echo "Rapport généré dans : $OUTPUT"
