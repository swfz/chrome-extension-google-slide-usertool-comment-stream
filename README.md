# chrome-extension-google-slide-usertool-comment-stream

Chrome Extension to flow comments posted on User Tools onto slides.

![alt](images/stream.gif)

## Install

[googleslide-comment-stream](https://chrome.google.com/webstore/detail/googleslide-comment-strea/cjhbnmagndpfjadnpbceahnccfpbmaii)

Add the extension to Chrome from the Store URL above

## How to use

### Start Slide Show

Click on Presenter Display

![Start Slide Show](images/how-to-use-01.png)

### Launch User Tools

![Launch User Tools](images/how-to-use-02.png)

Click "Start a new session" on the User Tools tab to start a User Tools session in a new tab

### Access and share URLs

![Access and share URLs](images/how-to-use-03.png)

The URL of the user tool will be displayed on both the slide side and the presenter, and will be shared with the members listening to the presentation.

### Presenter side settings

![User tool side settings](images/how-to-use-09.png)

Right-click on the title bar and press the "View in tabs" button

![User tool side settings](images/how-to-use-10.png)

Enter the settings for the areas you want to change from the defaults and click "Start".

### Presentation side settings

![Presentation side settings](images/how-to-use-06.png)

The presentation slide side will also be set up.

![Presentation side settings](images/how-to-use-07.png)

The settings are synchronized, so if you have changed the settings in the previous step, they should be reflected.

### Ready to go

![Ready to go](images/how-to-use-08.png)

When you post a comment in the User Tools, the comment will flow to the slide side

## Extra(Clap)

If you post a series of `8`, an applause effect will be displayed in the lower right corner of the screen for each successive `8` posted.

![Clap](images/clap.gif)

## development

```shell
yarn dev
```

load `dist` directory with "Load Unpackaged Extensions"
