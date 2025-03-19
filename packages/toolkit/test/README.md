# Testing docs & notes

We use the Vitest test runner, which exposes an API very similar to Jest's, but is customized to work well with the Vite build system.

## References

- Vitest: https://vitest.dev/api/
- `@xstate/test`: https://graph-docs.vercel.app/model-based-testing/quickstart
  -- **not** the section on the official XState site's docs - we're using the latest pre-release version of `@xstate/test`, which has a substantially different API.

## Unit tests

Unit tests are with Vitest (which exposes a very similar API to Jest) and located in `test/unit/*`.

## Model-based testing

Model-based testing uses the `@xstate/test` library to generate test cases.

In model-based testing, we build a simplified model of the system under test that describes its behavior under the tested conditions. Typically, each of the model's states corresponds to some assertions about the system under test in a given state, while each of the model's state transitions corresponds to some action performed on the system under test. Then the test runner tests the system under test via each possible path through the model's states and transitions.

`test/model-based/example.md` has a documented example of a model-based test with `@xstate/test`.

### Note: model-based testing of models

We're using `@xstate/test` to test XState models, among other things.

This is somewhat coincidental. There's no special relationship between the `@xstate/test` test model/state machine and the system under test, even if the system under test is itself an XState model/state machine. XState models are well suited to testing with MBT because they describe finite state machines, and MBT describes behaviors under test as finite state machines. But XState models can be tested by other methods, and MBT can be used to test other systems.
