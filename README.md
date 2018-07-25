## Live Slide Share App
---

This primitive application is only for learning about ionic, it has NO:
* User authentication and session management.
* Database Integration
* Multi-presentations per application
* master/slave presentation mode
* ....
* ....

To install and to run in development mode:
#### Server Side

```bash
cd server
npm install
npm dev
``` 

#### Client Side
```bash
npm install
npm run ionic:serve
```

Then open [http://localhost:8100](http://localhost:8100)

#### Presentations

* Slides are prepared as html files with names of 1.html, 2.html, ...etc. Files are saved in one directory, and offered publicly on http server.
* Separate css and js files are allowed per slide
* User prepare a config file in json format, such as:
```json
{
    "username":"suhel",
    "url":"http://localhost:3001/seminars/1",
    "size": 3,
    "num":1,
}
```
(url: full path to presentation directory)

#### Using the app:

* Join with your nickname:

<img src="docs/images/home.png" width="300px"/>

<!-- ![join ](docs/images/home.png) -->

* Set json configuration file in the presentation page

<img src="docs/images/join.png" width="300px"/>

* All users are synchronized to the same slide

<img src="docs/images/sync_slides1.png" width="500px"/>
<img src="docs/images/sync_slides2.png" width="500px"/>
<img src="docs/images/sync_slides3.png" width="500px"/>

<!-- ![switch slides ](docs/images/sync_slides1.png | width=450)
![switch slides ](docs/images/sync_slides2.png| width=450)
![switch slides ](docs/images/sync_slides3.png| width=450) -->

* Nofifications of joinings and leaving users

<img src="docs/images/join_adam_running.png" width="300px"/>
<!-- ![Notification ](docs/images/join_adam_running.png | width=300) -->


