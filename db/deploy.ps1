$DB_NAME = "projetweb"
$DUMP_FILE = "projetweb.dump"
$PG_BIN = "C:\Program Files\PostgreSQL\15\bin"

Write-Host ""
Write-Host "----------------------------------------"
Write-Host "   Gestion PostgreSQL pour ProjetWeb"
Write-Host "----------------------------------------"
Write-Host ""
Write-Host "1) Créer la base (si absente) + Importer"
Write-Host "2) Exporter la base"
Write-Host "3) Supprimer la base"
Write-Host "4) Quitter"
Write-Host ""
$choice = Read-Host "Choix"

switch ($choice) {

  "1" {
    Write-Host "`n📥 Import de la base PostgreSQL`n"

    $exists = & "$PG_BIN\psql.exe" -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME';"

    if ($exists -ne "1") {
      Write-Host "➡ Création de la base $DB_NAME"
      & "$PG_BIN\createdb.exe" -U postgres $DB_NAME
    } else {
      Write-Host "✔ La base existe déjà"
    }

    if (-Not (Test-Path $DUMP_FILE)) {
      Write-Host "❌ Fichier $DUMP_FILE introuvable"
      exit
    }

    Write-Host "➡ Import du dump..."
    & "$PG_BIN\pg_restore.exe" --clean --if-exists -U postgres -d $DB_NAME $DUMP_FILE

    Write-Host "✔ Import terminé"
  }

  "2" {
    Write-Host "`n📤 Export de la base PostgreSQL`n"

    $file = Read-Host "Nom du fichier (défaut: $DUMP_FILE)"
    if ($file -eq "") { $file = $DUMP_FILE }

    & "$PG_BIN\pg_dump.exe" -U postgres -F c -d $DB_NAME -f $file

    Write-Host "✔ Export terminé : $file"
  }

  "3" {
    Write-Host "`n⚠ Suppression de la base $DB_NAME"
    $confirm = Read-Host "Confirmer (y/n)"

    if ($confirm -eq "y") {
      & "$PG_BIN\dropdb.exe" -U postgres $DB_NAME
      Write-Host "✔ Base supprimée"
    } else {
      Write-Host "❌ Annulé"
    }
  }

  "4" {
    Write-Host "👋 Fin"
    exit
  }

  default {
    Write-Host "❌ Choix invalide"
  }
}
