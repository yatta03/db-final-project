## 資料夾架構：

```
└── 📁app
    └── 📁public
        └── 公開的靜態圖片、圖標等資源（可以直接從 url 找到）
    └── 📁src
        └── App.css
        └── App.jsx
        └── 📁assets
            └── 圖片圖標資源，但不能直接從 url 取用
        └── index.css
        └── main.jsx

        (└── 📁Pages
            └── 📁各頁面
                └──各頁面需要的元件等等
            ...)
    └── .env
    └── .gitignore
    └── eslint.config.js
    └── index.html
    └── package-lock.json
    └── package.json
    └── README.md
    └── vite.config.js
```

**package.json, package-lock.json**:  
定義 npm install 要下載的 dependency 跟版本，還有執行指令(dev, build...)

**.env**:（暫無  
放敏感資料（資料庫密碼、access key 等等），一般不會放上來，到時候 supabase 應該會用到，再放範本檔上來各自填

**index.html**:  
外圍的 html，最後渲染產生的網頁都會被包在這裡面:

```
<div id="root"></div>
```

**main**:  
沒了解太細，只知道 main 會包著 App，定義渲染模式之類的（？

**App.jsx**:  
主要的 Component，我之前是在這裡放 Router（每個頁面對應到的 url 規則）跟 Navbar 的元件  
router 會像這樣:

```
<Route path="/competition/:compId" element={<CompDetailPage />} />
```

**(Pages...)**:  
感覺可以參考 [How To Structure React Projects From Beginner To Advanced](https://blog.webdevsimplified.com/2022-07/react-folder-structure/)
的 intermediate-folder-structure 部分來管理文件（？

## React

**Hook**:  
之前基本上只用到 useState 跟 useEffect  
[官方文件](https://react.dev/blog/2023/03/16/introducing-react-dev)
