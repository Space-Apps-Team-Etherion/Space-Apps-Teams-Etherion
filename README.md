# Space-Apps-Teams-Etherion

git clone git@github.com:Space-Apps-Team-Etherion/Space-Apps-Teams-Etherion.git

cd Space-Apps-Teams-Etherion

docker compose up


backend → ton API FastAPI custom (exemple sur http://localhost:8002).

frontend → interface React servie par Nginx sur http://localhost:3000.


Tu peux interconnecter les services (par ex. le frontend appelle http://backend:8000/api/... dans le réseau interne Docker).