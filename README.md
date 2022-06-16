# Moy-Auth

Microservice which would attempt to handle all user-related data.
The idea is that all other services can query certain endpoints in this service, to check the state of the token, etc.

## Endpoints /auth
<dl>
    <dt>GET /</dt>
    <dd>Help command, it should return all endpoints</dd>
    <dt>GET /status</dt>
    <dd>check the current status of the token. Returns user uid when token is still alive</dd>
    <dt>POST /login</dt>
    <dd>expects a body <code>{ token: mytoken123 }</code> and returns the new token that will be used by moy services to handle authentication. Failing to do this step and using the default firebase token will result in logout</dd>
    <dt>GET /logout</dt>
    <dd>Checks token in header, and if the token is alive, it revokes the session and logs out the user</dd>
</dl>
