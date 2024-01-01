docker build -t admin-fe .
docker run \
    --env-file=.env \
    --name=admin-frontend \
    --network=case-study \
    -p=8101:8101 \
    --rm \
    admin-fe