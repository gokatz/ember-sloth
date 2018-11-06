# ember-sloth
<div style="text-align:center">
  <img src ="https://image.ibb.co/bOPGzx/105ee17e0ae8112ecfcff00d9e967b29.jpg" width="20%"  />
</div>

Sloth will help you to load a huge list lazily. You can lazy load your data using either of the below technique
  * [By listening scroll event inside list.](#on-scroll-into-the-list)
  * [By using background tasks.](#background-tasks) (using `window.requestIdleCallback` and fallback to `setTimeout`)

Perfectly lightweight - [130B Min + GZip](https://bundlephobia.com/result?p=ember-sloth@0.0.2). Play around with the [demo](https://ember-sloth.netlify.com/)

## Why Sloth?

Sloth is meant for his slowness. Is that the reason? No, the reason is, we are going to make him a lot faster 😉 

## Usage

Sloth will give you a property `dataForCurrentView` to loop over the passed data. Since Ember 🐹 will do the heavy weight-lifting for us by efficiently loading the list using `each` helper, you can relax and sit back!

Additionally, you can pass `loadCount` and `initialDataCount` to customize the initial load.

* **initialDataCount :** How many items should Sloth render on initial load. Defaults to `20`
* **loadCount :** How many items should the Sloth load on reaching the threshold (2/3 of the current list length). Defaults to `10`

### On Scroll into the list

Since Sloth will watch the scroll event on a list container to lazy load the data, make sure you create a container manually with the `id` attribute as `slothScroll` (or anything of your choice) and specify the **definite height**. If your container has the id other than `slothScroll`, then pass the name of the id attribute (to bind action) as an argument, `scrollContainer`:

```hbs
{{!-- template.hbs --}}
{{#sloth-loader 
  data=thatBigListofPosts 
  initialDataCount=50 
  loadCount=20 
  scrollContainer="postContainer"
  as |sloth|
}}

  <div id="postContainer" class="post-container"> {{!-- container --}}
    {{#each sloth.dataForCurrentView as |post|}}
      {{pretty-post post=post}}
    {{/each}}
  </div>

{{/sloth-loader}}
```

```css
/* app.css */
.post-container {
  height: 75vh;
}
```

**NOTE:** If your data should be load highly on demand (on scroll) like a facebook feed. This option will be the apt one. If you don't have a specific use case and the only requirement is to defer the loading of a bulk list to avoid janky pages, **you should definitely try the [background task](#background-tasks) method** as it won't need any extra work from the host application side. 

### Background Tasks

This would be the most appropriate choice in most cases since it won't require any additional containers to create nor any style manipulations. The list will be loaded lazily on the window's `requestIdleCallback`. The event will be fired when the browser gets an idle relaxing time. It would be an appropriate time to load the remaining items onto the list. If the browser doesn't support `requestIdleCallback` then the data will be loaded using `setTimeout` with an interval time.

To use this method, we need to pass two arguments:
* `enableBackgroundLoad` : Defaults to `false`
* `loadInterval`  : Denoted in `ms` and defaults to `200` (200ms). This serves two purposes:
    1) When the browser supports `requestIdleCallback`, then `loadInterval` will be used as a threshold time. If the event is not fired within the given time, data loading will be triggered forcefully.
    2) When the browser doesn't support `requestIdleCallback` and fell back to `setTimeout`, then this time will be used as a timeout for `setTimeout`.

```hbs
{{!-- template.hbs --}}

{{#sloth-loader 
  data=thatBigListofPosts 
  initialDataCount=50 
  loadCount=20 
  enableBackgroundLoad=true
  loadInterval=500
  as |sloth|
}}

  {{#each sloth.dataForCurrentView as |post|}}
    {{pretty-post post=post}}
  {{/each}}

{{/sloth-loader}}
```

## Haaalp
Let's work together to make **Sloth** awesome:
* Sloth has zero test. Need help in writing sophisticated tests.
* Exploring `Intersection Observer API` for data load

