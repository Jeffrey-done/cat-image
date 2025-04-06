# 云图床 - GitHub图片上传工具 (Cloudflare代理版)

这是一个美观且功能强大的图片上传工具，允许用户将图片上传到GitHub仓库，并自动生成使用jsDelivr加速的CDN链接。此版本使用Cloudflare Workers作为中间层，无需在前端暴露GitHub凭据。

## 特性

- 🖼️ **拖放上传**：支持拖放图片到上传区域
- 📁 **多文件上传**：一次可以上传多个图片文件
- 🚀 **CDN加速**：使用jsDelivr CDN提供全球加速
- 📋 **多种链接格式**：支持URL、Markdown和HTML格式的链接复制
- 🔒 **安全凭据**：GitHub凭据存储在Cloudflare Workers中，不在前端暴露
- 🔄 **上传进度**：实时显示上传进度
- 📱 **响应式设计**：适配各种屏幕大小

## 部署指南

### 1. 准备工作

- 一个GitHub账户和仓库（用于存储图片）
- GitHub个人访问令牌（Personal Access Token，需要有repo权限）
- Cloudflare账户

### 2. 部署Cloudflare Worker

1. 登录您的Cloudflare账户，前往Workers & Pages
2. 点击"创建应用程序"，选择"Workers"
3. 创建一个新的Worker
4. 将项目中的`cloudflare-worker.js`文件内容复制到Worker编辑器中
5. 点击"保存并部署"

### 3. 配置环境变量

1. 在Worker详情页面，点击"设置"标签
2. 在"环境变量"部分，添加以下变量：
   - `GITHUB_TOKEN`: 您的GitHub个人访问令牌
   - `GITHUB_USERNAME`: 您的GitHub用户名
   - `GITHUB_REPO`: 您的GitHub仓库名
   - `GITHUB_BRANCH`: 您的GitHub分支名（可选，默认为main）
3. 点击"保存"

### 4. 配置前端

1. 编辑`js/app.js`文件，将`API_BASE_URL`变量的值替换为您的Cloudflare Worker URL
2. 将所有文件上传到您的网站空间或GitHub Pages

### 5. 使用

1. 打开前端页面
2. 拖拽图片或点击上传区域选择图片
3. 点击"开始上传"按钮上传图片
4. 上传完成后，复制生成的jsDelivr链接

## 技术细节

### Cloudflare Worker API接口

Worker提供两个主要接口：

- `/config` (GET): 获取仓库配置信息（不包含敏感信息）
- `/upload` (POST): 处理图片上传到GitHub

### 安全性考虑

- GitHub令牌存储在Cloudflare Workers的环境变量中，不会在前端暴露
- 所有API请求都通过Cloudflare Workers处理，提供额外的安全层
- CORS策略限制可能需要根据您的部署环境进行调整

## 技术栈

- 前端：原生JavaScript和CSS
- 后端中间层：Cloudflare Workers
- 存储：GitHub仓库
- CDN：jsDelivr

## 许可证

MIT 