# SolarSystemGuide - API

<p><em>This document provides general information on the SolarSystemGuide client-side application.  For more information about the SolarSystemGuide API, please see <a href="https://github.com/jackseabolt/SolarSystemGuide/blob/master/README.md">SolarSystemGuide-backendAPI</a>.</em></p>

Why SolarSystemGuide-backendAPI
-------------
This API serves information about objects in the solar system. It was designed to serve as a backend for SolarSystemGuide, but may be accessed by anyone who would like to access the information contained within the database. 

<table layout="fixed">
  <tr>
    <td width="55%">
      GET Request to this route will return a list of all the planets in the solar system with details.
    </td>
    <td width = "40%">
       <h4> https://solarsystemguide.herokuapp.com/api/planets</h4>
    </td>
  </tr>
  <!-- <tr>
    <td>
      <p>When a new patron arrives, the server includes simple, additional information required for the ongoing bac calculation.          </p>
    </td>
    <td>
      <img src="/img/buzz-kill-addpatron.png" max-height="240px" witdh="auto">
    </td>
  </tr>
  <tr>
    <td>
      <p>The large numbers and color coding make the patron tile easy to understand.  Additionl information available includes seat location, time of stay, and a graphic representation of drink purchases.</p>
    </td>
    <td>
      <img src="/img/buzz-kill-patrondet.png" max-height="240px" witdh="auto">
    </td>
  </tr>
  <tr>
    <td>
      <p>And if someone goes too far, help is a click away.</p>
    </td>
    <td>
      <img src="/img/buzz-kill-patronemergency.png" max-height="240px" witdh="auto">
    </td>
  </tr> -->
</table>




 
<br><br>

#### https://solarsystemguide.herokuapp.com/api/planets/:planetName
GET Request to this route will return a single planet with details.
<br><br>

#### https://solarsystemguide.herokuapp.com/api/planets/:planetId/comments
POST Request to this route (Authenticated Users Only) will allow users to POST comments to a planetId. 
<br><br>

#### https://solarsystemguide.herokuapp.com/api/planets/:planetId/comments/:commentId
PUT Request to this route (Authenticated Users Only) will allow users to EDIT their comments to a planetId. 
<br><br>

#### https://solarsystemguide.herokuapp.com/api/planets/:planetId/comments/:commentId
DELETE Request to this route (Authenticated Users Only) will allow users to DELETE their comments to a planetId. 

<br />
## ScreenShot of GET Request
<img src="./ScreenShot.png">

<h2>Technology</h2>
This app was constructed using Javascript, Express, Passport Authentication, bCrypt, Mongo, Mongoose.

<h2>Authors</h2>
This API was constructed by Jack Seabolt and Eric Pcholinski.
