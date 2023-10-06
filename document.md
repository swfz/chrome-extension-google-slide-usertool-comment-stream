# Document

自分が思い出すためのドキュメント

以下3種類のページに対して拡張機能をONにする必要がある

- Presenter
  - ページ送りとかカンペとかが見える画面
- Slide
  - 発表スライド
- Usertool(さくら機能を使うときは必要)
  - 聴講者がコメントを投稿する画面

## やり取りの流れ

Extは各ページで動作する拡張（ContentsScript）

```mermaid
sequenceDiagram
    actor Audience as Audience
    participant Usertool as Usertool
    participant UsertoolExt as Usertool(Ext)
    participant Slide as Google Slide
    participant SlideExt as Google Slide(Ext)
    participant Presenter as Presenter
    participant PresenterExt as Presenter(Ext)
    actor Speaker as Speaker

    opt さくら機能
      Note left of Speaker: 拡張のOptionで設定を行う
      Note left of Speaker: 起動時`Use Plant`をチェック
    end
    Speaker->>Slide: Slide Mode
    activate Slide
    Slide->>Presenter: Open Presenter
    activate Presenter
    Speaker->>SlideExt: Start Extension
    activate SlideExt
    SlideExt->>Slide: Inject ContentsScript
    SlideExt->>Slide: Create BroadcastChannel
    Note over Slide,SlideExt: 受信用(comment)
    SlideExt->>Slide: Regist EventHandler
    Note over Slide,SlideExt: 受け取ったメッセージをスライドに流す処理
    opt さくら機能
      SlideExt->>Slide: Inject ContentsScript
      SlideExt->>Slide: Create BroadcastChannel
      Note over SlideExt,Slide: 送信用(sakura)
      SlideExt->>Slide: Attach MutationObserver
      Note over SlideExt,Slide: ページ番号のDOM変更を購読しBroadcastChannnelに流す
    end
    Speaker->>Presenter: Display in Tab
    Speaker->>Presenter: Boot Usertool
    Presenter->>Usertool: Create Room
    activate Usertool
    Usertool-->>Presenter: URL
    Presenter-->>Speaker: Display Usertool URL
    Speaker->>PresenterExt: Start Extension
    activate PresenterExt
    PresenterExt->>Presenter: Inject ContentsScript
    PresenterExt->>Presenter: Create BroadcastChannel
    Note over Presenter,PresenterExt: 送信用(comment)
    PresenterExt->>Presenter: Attach MutationObserver
    Note over Presenter,PresenterExt: コメントのDOM変更を購読しBroadcastChannnelに流す
    opt さくら機能
      Speaker->>UsertoolExt: Start Extension
      activate UsertoolExt
      UsertoolExt->>Usertool: Inject ContentsScript
      UsertoolExt->>Usertool: Create BroadcastChannel
      Note over UsertoolExt,Usertool: 受信用(sakura)
      UsertoolExt->>Usertool: Regist EventHandler
      Note over UsertoolExt,Usertool: 受け取った仕込みコメントを投稿する処理
    end
    Speaker->>Audience: Share Usertool URL
    Audience->>Usertool: Access
    Usertool-->>Audience: Display
    Speaker->>Presenter: Navigate to Page2
    Presenter->>Slide: Navigate to Page2
    Slide->>Audience: Display Page2
    Speaker->>Presenter: Navigate to Page3
    Presenter->>Slide: Navigate to Page3
    Slide->>Audience: Display Page3
    opt さくら機能、3ページ目で仕込みコメント設定がある場合
      Slide->>SlideExt: DOM Changes
      Note over Slide,SlideExt: ページ番号のDOM変更を検知
      SlideExt->>UsertoolExt: Forward Message with BroadcastChannel
      Note over SlideExt,UsertoolExt: DOMの変更からページ番号を抜き出す
      Note over SlideExt,UsertoolExt: 設定からページ番号の仕込みコメントを取得
      Note over SlideExt,UsertoolExt: 仕込みコメントを設定の秒数後に送信
      UsertoolExt->>Usertool: PostMessage
      Note over Usertool,UsertoolExt: 受け取った仕込みコメントを匿名で送信
      Usertool->>Presenter: Display Comments
      Note over Usertool,Presenter: 投稿されると程なくプレゼンター側に投稿された内容が表示される
      Presenter->>PresenterExt: DOM Changes
      PresenterExt->>SlideExt: Forward Message with BroadcastChannnel
      Note over PresenterExt,SlideExt: DOMの変更からコメント箇所を抜きだし送信
      SlideExt->>Slide: Displaying recieved message
      Note over SlideExt,Slide: 受信したコメントをSlide上に横移動させながら表示
    end
    Audience->>Usertool: Post Comment
    Usertool->>Presenter: Display Comments
    Note over Usertool,Presenter: 投稿されると程なくプレゼンター側に投稿された内容が表示される
    Presenter->>PresenterExt: DOM Changes
    PresenterExt->>SlideExt: Forward Message with BroadcastChannnel
    Note over PresenterExt,SlideExt: DOMの変更からコメント箇所を抜きだし送信
    SlideExt->>Slide: Displaying recieved message
    Note over SlideExt,Slide: 受信したコメントをSlide上に横移動させながら表示
    deactivate Slide
    deactivate SlideExt
    deactivate Presenter
    deactivate Usertool
    deactivate PresenterExt
    deactivate UsertoolExt
```
