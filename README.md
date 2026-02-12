## 拡張機能の更新手順 (Development Flow)

`twn` 言語に新しい命令を追加したり、文法を変更した場合の更新フローです。

### 1. 文法定義の更新

`tree-sitter-twn/grammar.js` を編集して、新しい命令や構文を追加します。

### 2. パーサーの再生成

Tree-sitterに変更を認識させるため、必ず再生成コマンドを実行します。

```bash
cd tree-sitter-twn
tree-sitter generate
```

### 3. 文法リポジトリの更新 (Git Push)

Zedはローカルファイルではなく、`extension.toml` に記載されたGitHub上のコミットを参照して文法をダウンロードします。そのため、変更をGitHubへプッシュする必要があります。

```bash
# tree-sitter-twn ディレクトリで
git add .
git commit -m "Add new opcodes"
git push
```

### 4. 拡張機能の参照先を更新

プッシュした最新のコミットハッシュを Zed に伝えます。

1. **最新コミットハッシュの取得**:

```bash
git rev-parse HEAD
```

2. **`extension.toml` の書き換え**:
   `twn-extension/extension.toml` を開き、`commit` の値を上記で取得したハッシュに書き換えます。

```toml
[grammars.twn]
repository = "[https://github.com/YourName/tree-sitter-twn](https://github.com/YourName/tree-sitter-twn)"
commit = "ここに新しいハッシュを貼り付け"
```

### 5. Zed での再読み込み

Zed 上で変更を反映させます。

1. コマンドパレット (`Ctrl+Shift+P`) を開く。
2. `window: reload` を実行（または Zed を再起動）。
