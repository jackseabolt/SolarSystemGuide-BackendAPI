# Planet App

Allows general users to retreive solar system data from a database.

## API Documentation

https://solarsystem-api.herokuapp.com/api/planets
GET Request to this route will return a list of all the planets in the solar system with details. 

https://solarsystem-api.herokuapp.com/api/planets/:planetId
GET Request to this route will return a single planet with details.

https://solarsystem-api.herokuapp.com/api/planets/:planetId/comments
POST Request to this route (Authenticated Users Only) will allow users to POST comments to a planetId. 

https://solarsystem-api.herokuapp.com/api/planets/:planetId/comments/:commentId
PUT Request to this route (Authenticated Users Only) will allow users to EDIT their comments to a planetId. 

https://solarsystem-api.herokuapp.com/api/planets/:planetId/comments/:commentId
DELETE Request to this route (Authenticated Users Only) will allow users to DELETE their comments to a planetId. 

<img src = "ScreenShot.png"