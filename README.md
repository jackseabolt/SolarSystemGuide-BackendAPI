# SolarSystemGuide-backendAPI

<p><em>This document provides general information on the SolarSystemGuide client-side application.  For more information about the SolarSystemGuide API, please see <a href="https://github.com/jackseabolt/SolarSystemGuide/blob/master/README.md">SolarSystemGuide-backendAPI</a>.</em></p>

Why SolarSystemGuide-backendAPI
-------------
This API serves information about objects in the solar system. It was designed to serve as a backend for SolarSystemGuide, but may be accessed by anyone who would like to access the information contained within the database. 
<br /><br />
<table layout="fixed">
  <tr>
    <td width="55%">
      GET Request to this route will return a list of all the planets in the solar system with details.
    </td>
    <td width = "40%">
       <h4> https://solarsystemguide.herokuapp.com/api/planets</h4>
    </td>
  </tr>
  <tr>
    <td width="55%">
      GET Request to this route will return a single planet with details.  
    </td>
    <td width = "40%">
        <h4>https://solarsystemguide.herokuapp.com/api/planets/:planetName</h4>
    </td>
  </tr>
  <tr>
    <td width="55%">
      POST Request to this route (Authenticated Users Only) will allow users to POST comments to a planetId. 
    </td>
    <td width = "40%">
      <h4>https://solarsystemguide.herokuapp.com/api/planets/:planetId/comments</h4>
    </td>
  </tr>
  <tr>
    <td width="55%">
      PUT Request to this route (Authenticated Users Only) will allow users to EDIT their comments to a planetId. 
    </td>
    <td width = "40%">
       <h4>https://solarsystemguide.herokuapp.com/api/planets/:planetId/comments/:commentId</h4>
    </td>
  </tr>
  <tr>
    <td width="55%">
      DELETE Request to this route (Authenticated Users Only) will allow users to DELETE their comments to a planetId. 
    </td>
    <td width = "40%">
       <h4>https://solarsystemguide.herokuapp.com/api/planets/:planetId/comments/:commentId</h4>
    </td>
  </tr>
</table>


<br /><br />
## ScreenShot of GET Request
<img src="./ScreenShot.png">

<h2>Technology</h2>
This app was constructed using Javascript, Express, Passport Authentication, bCrypt, Mongo, Mongoose.

<h2>Authors</h2>
This API was constructed by Jack Seabolt and Eric Pcholinski.
