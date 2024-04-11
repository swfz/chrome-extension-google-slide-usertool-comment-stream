# chrome-extension-google-slide-usertool-comment-stream

Chrome Extension to flow comments posted on User Tools onto slides.

Comment data is available in the user tools included with Google Slides, so there is no need to send data anywhere, making it easy to get started at work, etc.

<!-- ![alt](images/stream.gif) -->

![alt](images/demo_stream.gif)

## Install

[googleslide-comment-stream](https://chrome.google.com/webstore/detail/googleslide-comment-strea/cjhbnmagndpfjadnpbceahnccfpbmaii)

Add the extension to Chrome from the Store URL above

## How to use

| step                  | description                                                                                                                                                         | image                           |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------ |
| Start Slide Show      | Click on Presenter Display                                                                                                                                          | <img src="images/step01.png" /> |
| Launch User Tools     | Click "Start a new session" on the User Tools tab to start a User Tools session in a new tab                                                                        | <img src="images/step02.png" /> |
| Access and share URLs | The URL of the user tool will be displayed on both the slide side and the presenter, and will be shared with the members listening to the presentation.             | <img src="images/step03.png" /> |
| Presenter settings    | Right-click on the title bar and press the "View in tabs" button                                                                                                    | <img src="images/step04.png" /> |
| Presenter settings    | Enter the settings for the areas you want to change from the defaults and click "Start".                                                                            | <img src="images/step05.png" /> |
| Slide settings        | The presentation slide side will also be set up. The settings are synchronized, so if you have changed the settings in the previous step, they should be reflected. | <img src="images/step06.png" /> |
| Usertool settings     | Open the Extended menu and press Start as in the above two cases.                                                                                                   | <img src="images/step07.png" /> |
| Ready to go           | When you post a comment in the User Tools, the comment will flow to the slide side                                                                                  |                                 |

## Overview

There are three screen types used in this extension: presenter slide usertool

| Presenter                          | Slide                      | Usertool                         |
| :--------------------------------- | :------------------------- | :------------------------------- |
| ![Presenter](images/presenter.png) | ![Slide](images/slide.png) | ![Usertool](images/usertool.png) |

content_script is running on each screen.

In contents_script, DOM change detection (MutationObserver) for comments and slide numbers, and messaging between screens (BroadcastChannel) are performed.

## Feature

### Normal comment flow

Audience comments on usertool

The commented content flows from right to left on the slide side.

### Clap

If you post a series of `8`, an applause effect will be displayed in the lower right corner of the screen for each successive `8` posted.

<img src="images/demo_clap.gif" height="200px">

### Download

<img src="images/downloadjson.png" height="200px">

You can download the list of commented comments

Once you have started the program on the presenter screen, click the "DownloadComments" button.

You can download the list of comments in json format.

- usertool-comments.json

```json
[
  {
    "user": "user1",
    "time": "20:11",
    "text": "sample comment"
  },
  {
    "user": "user1",
    "time": "20:11",
    "text": "foo"
  },
  {
    "user": "user1",
    "time": "20:11",
    "text": "bar"
  },
  {
    "user": "user1",
    "time": "20:11",
    "text": "88888888888"
  }
]
```

### Sakura

Ability to set comments to be broadcast in advance by yourself

You can control the reactions you want on specific slides and the flow of your presentation

Settings are made in `options

- key: slide page number
- seconds: number of seconds after page transition
- comment: comment to post

You can set the number of seconds after which slide number the comment will be posted.

<img src="images/plant_comment_setting.gif" height="200px">

The comment will be posted automatically as you advance through the slides.

<img src="images/plant_comment_execution.gif" height="200px">

## development

```shell
yarn dev
```

load `dist` directory with "Load Unpackaged Extensions"
