cd functions
(trap 'kill 0' SIGINT; npm run build & npm run serve)
trap SIGINT
echo 'Serve interrupted'
