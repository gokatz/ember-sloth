# ember-sloth
<div style="text-align:center">
	<img src ="https://image.ibb.co/bOPGzx/105ee17e0ae8112ecfcff00d9e967b29.jpg" width="20%"  />
</div>

Sloth will help you to load a huge list (or any kind of that) lazily on scrolling into the list. Perfectly lightweight - [130B Min + GZip](https://bundlephobia.com/result?p=ember-sloth@0.0.1)

## Why Sloth?

Sloth is meant for his slowness. Is that the reason? No, the reason is, we are going to make him a lot faster 😉 

## Usage

Sloth will give you a property `dataForCurrentView` to loop over the passed data. Since Ember 🐹 will do the heavy weight-lifting for us by efficiently loading the list using `each` helper, you can relax and sit back!

Additionaly you can pass `loadCount` and `initialDataCount` to customize the intial load.

* **initialDataCount :** How many items should Sloth render on initail load. Defaults to `20`
* **loadCount :** How may item Sloth should load on reaching the threshold (2/3 of the current list length). Defaults to `10`

Since Sloth will watch the scroll event on a list container to lazy load the data, make sure you specify the height of the container. Sloth will generate a root container (`div`) with the id `slothScroll` by default. You can pass a class to set the container height:

```hbs
{{#sloth-loader data=thatBigListofPosts initialDataCount=50 loadCount=20 class="post-container" as |sloth|}}
  {{#each sloth.dataForCurrentView as |post|}}
    {{pretty-post post=post}}
  {{/each}}
{{/sloth-loader}}
```

Alternatively, if you don't want Sloth to generate container, pass the tagName as `""` and make sure you create one manually with the `id` attribute as `slothScroll`:

```hbs
{{#sloth-loader tagName="" data=thatBigListofPosts initialDataCount=50 loadCount=20 as |sloth|}}
  <div id="slothScroll" class="post-container"> {{!-- container --}}
    {{#each sloth.dataForCurrentView as |post|}}
      {{pretty-post post=post}}
    {{/each}}
  </div>
{{/sloth-loader}}
```

## Halp
Let's work together to make **Sloth** awesome
