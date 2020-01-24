# Composable Behavior Using Hooks

There are a few techniques for composing functionality in React. Components themselves are composable if you allow children to be rendered. There are render-props to share functionality between different components. Providers – normally using context – can share state between components to enable theming, internationalization, and other data.

But with hooks, sharing behavior between components has been easier.

## Sharing Behaviors

The `src/utilties` folder has shared behaviors that can be reused by more than just the `pagination/PaginationExmaple.tsx` provided.
