# API Recorder

API Recorder is a Chrome extension that allows users to easily modify network requests and responses via HTTP and HTTPS, making API debugging and mock data response more efficient.

API Recorder 是一个 Chrome 扩展,通过它，用户可以方便地修改网络请求和响应，从而更高效地进行 API 调试、Mock 数据响应，简化 HTTP 请求的调试与管理 请求，提升开发效率。

## 目录
1. [功能概述](#功能概述)
2. [安装与配置](#安装与配置)
3. [主要功能](#主要功能)
4. [使用示例](#使用示例)
5. [常见问题](#常见问题)
6. [贡献指南](#贡献指南)
7. [许可证](#许可证)

## 功能概述
Api Recorder是一个轻量化的工具，专为前端开发者、后端以及测试提供必要的工具集成，帮助他们将代码的编写、测试和调试速度提高数倍。Api Recorder降低了前端开发者在开发和测试需求上对后端开发者和环境的依赖。

通过Api Recorder，开发者可以创建模拟、验证和覆盖API响应，修改响应等，使用Api Recorder进行更快的调试。

## 安装与配置
1.**下载扩展**: 在 Chrome 浏览器中打开扩展程序商店，搜索并下载 **API Recorder** 扩展。

2.**安装扩展**: 下载完成后，点击安装扩展。安装完成后，在 Chrome 浏览器工具栏中会出现 API Recorder 的图标。

3.**配置设置**: 安装后，点击工具栏中的 API Recorder 图标，进入设置页面，进行必要的配置：

   -**启用/禁用**: 可以随时启用或禁用拦截功能。
   -**配置 Mock 规则**: 添加或编辑需要 Mock 的 API 路径和对应的响应数据。

## 主要功能

### 1. HTTP 请求拦截

API Recorder 可以拦截浏览器发出的所有 HTTP 请求，并记录每个请求的详细信息，包括 URL、请求头、请求体等。

### 2. 修改和 Mock 响应

**修改响应**: 通过 API Recorder，开发者可以实时修改 API 响应的内容。这对于前端调试非常有帮助，尤其是在后端 API 尚未完成时，可以手动创建响应数据来继续前端开发。
  
**Mock 响应**: 根据设置的规则，API Recorder 可以在拦截请求时自动返回预设的 Mock 数据，而不需要发出真实的网络请求。

### 3. 版本控制与数据持久化

**版本管理**: 每个 API 路径最多可以保存 3 个响应版本。对于超过 3 个版本的响应，API Recorder 会自动替换最早的记录，以保证最新的响应数据始终可用。
  
**数据持久化**: API Recorder 使用浏览器的 localStorage 对拦截的响应数据进行缓存，使得在页面刷新后依然可以查看之前的拦截记录。

## 使用示例
#### 示例 1: 拦截并查看请求1. 启动 API Recorder 并启用拦截功能。
2. 浏览器访问任意 API。
3. 在 API Recorder 面板中查看已拦截的请求详情。

#### 示例 2: 修改 API 响应1. 在设置页面中添加一个新的 API 路径。
2. 输入想要返回的 Mock 数据。
3. 触发相应的 API 请求，查看修改后的响应。

## 常见问题

#### Q1: 如何清除缓存的数据？

在 API Recorder 设置页面中，点击“清除缓存”按钮即可删除所有缓存的响应数据。

#### Q2: 是否支持 HTTPS 请求的拦截？

是的，API Recorder 支持对 HTTP 和 HTTPS 请求的拦截和修改。

## 贡献指南

如果你想为 API Recorder 做出贡献，可以按照以下步骤进行：

1. Fork 这个仓库。
2. 创建一个新的分支（`git checkout -b feature/your-feature-name`）。
3. 提交你的更改（`git commit -m 'Add some feature'`）。
4. 推送到分支（`git push origin feature/your-feature-name`）。
5. 创建一个新的 Pull Request。

## 许可证

API Recorder 使用 [MIT 许可证](LICENSE) 进行许可。

---

感谢您使用 API Recorder。如果您有任何问题或建议，请随时与我们联系！