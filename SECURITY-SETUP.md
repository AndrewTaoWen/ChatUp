# Security deployment changes

Revoke the previously committed Chat Engine private key and review account activity. Removing the key from source does not revoke it or erase Git history.

Set CHAT_ENGINE_PROJECT_ID and CLIENT_ORIGIN in the backend process environment. Set VITE_CHAT_ENGINE_PROJECT_ID to the same project in the frontend build environment. Use HTTPS in production.

Authentication now verifies an existing user's password with Chat Engine. It no longer creates users or resets their secret based on a username. Provision users through the trusted Chat Engine dashboard and replace all legacy secrets that were equal to usernames before deployment. Public self-registration requires a separate verified enrollment flow.

The repository previously committed backend/node_modules. Those files should not be used for deployment; run npm ci in backend and frontend to install the reviewed lockfiles.
