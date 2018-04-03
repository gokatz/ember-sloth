# ember-sloth
<div style="text-align:center">
	<img src ="https://image.ibb.co/bOPGzx/105ee17e0ae8112ecfcff00d9e967b29.jpg" width="20%"  />
</div>

Sloth will help you to load a huge list (or any kind of that) lazily on scrolling into the list. Perfectly lightweight

## Why Sloth?

Sloth is meant for his slowness. Is that the reason? No, the reason is, we are going to make him a lot faster 😉 

## Usage

Sloth will give you a property `dataForCurrentView` to loop over the passed data. Since, Ember 🐹 will do the heavy weight-lift for us by efficiently load the list using `each` helper, we can relax and sit back! Additionaly you can pass `loadCount` and `initialDataCount` to customize the intial load.

* **initialDataCount :** How many items should Sloth render on initail load. Defaults to `20`
* **loadCount :** How may item the Sloth should load on reaching the threshold (2/3 of the current list length). Defaults to `10`

```hbs
{{#sloth-loader data=thatBigListofPosts initialDataCount=50 loadCount=20 as |postItem|}}
  {{#each postItem.dataForCurrentView as |post|}}
    {{pretty-post post=post}}
  {{/each}}
{{/sloth-loader}}
```

## Halp
Let's work together to make **Sloth** awesome
