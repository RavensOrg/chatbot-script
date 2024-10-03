# Ravens Chatbot script 
a JavaScript script that injects a basic chatbot into any website

## test

```shell
npm run dev
```

## usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot Example</title>
</head>
<!-- add your api key to body -->
<body data-ravens-api-key="my-example-api-key">
    <h1>Welcome to My Website</h1>
    <p>Feel free to interact with the chatbot in the bottom-right corner!</p>

    <!-- Injecting the chatbot script -->
    <script src="script.js"></script>
</body>
</html>

```