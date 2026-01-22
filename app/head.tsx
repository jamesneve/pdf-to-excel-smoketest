export default function Head() {
  return (
    <>
      <script async src="https://plausible.io/js/pa-qb6qooiSm4WW3FJtTy0rc.js"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
            plausible.init()
          `
        }}
      />
    </>
  );
}
