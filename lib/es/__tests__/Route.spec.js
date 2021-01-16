import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import React, { useState } from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { getRouter, reset, Route, useNavigo, Base, configureRouter } from "../NavigoReact";
import { expectContent, navigate, delay } from "../__tests_helpers__/utils";
var warn;
describe("Given navigo-react", function () {
  beforeEach(function () {
    reset();
    warn = jest.spyOn(console, "warn").mockImplementation(function () {});
    history.pushState({}, "", "/");
  });
  afterEach(function () {
    if (warn) {
      warn.mockReset();
    }
  });
  describe("when using the Route component", function () {
    it("should render the children if the path matches on the first render", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var CompA;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              CompA = function _CompA() {
                var _useNavigo = useNavigo(),
                    match = _useNavigo.match;

                if (match) {
                  return /*#__PURE__*/React.createElement("p", null, "A");
                }

                return null;
              };

              history.pushState({}, "", "/app/foo/bar");
              render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Base, {
                path: "app"
              }), /*#__PURE__*/React.createElement(Route, {
                path: "/foo/:id",
                loose: true
              }, /*#__PURE__*/React.createElement(CompA, null)), /*#__PURE__*/React.createElement(Route, {
                path: "/foo/:id"
              }, /*#__PURE__*/React.createElement("p", null, "B"))));
              expectContent("AB");

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    it("should gives us access to the Match object", function () {
      history.pushState({}, "", "/foo/bar");
      var CompB = jest.fn().mockImplementation(function () {
        var _useNavigo2 = useNavigo(),
            match = _useNavigo2.match; // @ts-ignore


        return /*#__PURE__*/React.createElement("p", null, "B", match.data.id);
      });
      render( /*#__PURE__*/React.createElement("div", {
        "data-testid": "container"
      }, /*#__PURE__*/React.createElement(Route, {
        path: "/foo/:id"
      }, /*#__PURE__*/React.createElement(CompB, {
        a: "b"
      }))));
      expect(CompB).toBeCalledTimes(1);
      expect(CompB.mock.calls[0][0]).toStrictEqual({
        a: "b"
      });
    });
    it("should add a route and remove it when we unmount the component", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var Wrapper, Comp, _render, getByText;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              Comp = function _Comp() {
                var _useNavigo3 = useNavigo(),
                    match = _useNavigo3.match;

                return match ? /*#__PURE__*/React.createElement("p", null, "Match") : /*#__PURE__*/React.createElement("p", null, "No Match");
              };

              Wrapper = function _Wrapper() {
                var _useState = useState(0),
                    count = _useState[0],
                    setCount = _useState[1];

                if (count >= 2 && count < 4) {
                  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Route, {
                    path: "/foo",
                    loose: true
                  }, /*#__PURE__*/React.createElement(Comp, null)), /*#__PURE__*/React.createElement("button", {
                    onClick: function onClick() {
                      return setCount(count + 1);
                    }
                  }, "button"));
                }

                return /*#__PURE__*/React.createElement("button", {
                  onClick: function onClick() {
                    return setCount(count + 1);
                  }
                }, "button");
              };

              _render = render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Wrapper, null))), getByText = _render.getByText;
              fireEvent.click(getByText("button"));
              expectContent("button");
              _context2.next = 7;
              return waitFor(function () {
                fireEvent.click(getByText("button"));
              });

            case 7:
              expectContent("No Matchbutton");
              expect(getRouter().routes).toHaveLength(1);
              _context2.next = 11;
              return waitFor(function () {
                navigate("/foo");
              });

            case 11:
              expectContent("Matchbutton");
              _context2.next = 14;
              return waitFor(function () {
                fireEvent.click(getByText("button"));
              });

            case 14:
              _context2.next = 16;
              return waitFor(function () {
                fireEvent.click(getByText("button"));
                fireEvent.click(getByText("button"));
              });

            case 16:
              expectContent("button");
              expect(getRouter().routes).toHaveLength(0);

            case 18:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    it("should give us proper Match object if the path matches on the first render", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      var Comp;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              Comp = function _Comp2() {
                var _useNavigo4 = useNavigo(),
                    match = _useNavigo4.match;

                if (match) {
                  // @ts-ignore
                  return /*#__PURE__*/React.createElement("p", null, "Matching ", match.data.id);
                }

                return /*#__PURE__*/React.createElement("p", null, "Nope");
              };

              history.pushState({}, "", "/foo/bar");
              render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Route, {
                path: "/foo/:id",
                loose: true
              }, /*#__PURE__*/React.createElement(Comp, null))));
              expectContent("Matching bar");

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    describe("and we have multiple components", function () {
      it("should properly resolve the paths", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
        var CompA, CompB;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                CompB = function _CompB() {
                  var _useNavigo6 = useNavigo(),
                      match = _useNavigo6.match;

                  if (match) {
                    // @ts-ignore
                    return /*#__PURE__*/React.createElement("p", null, "Products");
                  }

                  return null;
                };

                CompA = function _CompA2() {
                  var _useNavigo5 = useNavigo(),
                      match = _useNavigo5.match;

                  if (match) {
                    // @ts-ignore
                    return /*#__PURE__*/React.createElement("p", null, "About");
                  }

                  return null;
                };

                render( /*#__PURE__*/React.createElement("div", {
                  "data-testid": "container"
                }, /*#__PURE__*/React.createElement(Route, {
                  path: "/about",
                  loose: true
                }, /*#__PURE__*/React.createElement(CompA, null)), /*#__PURE__*/React.createElement(Route, {
                  path: "/products",
                  loose: true
                }, /*#__PURE__*/React.createElement(CompB, null))));
                expect(screen.getByTestId("container").textContent).toEqual("");
                _context4.next = 6;
                return navigate("/about");

              case 6:
                expect(screen.getByTestId("container").textContent).toEqual("About");
                _context4.next = 9;
                return navigate("products");

              case 9:
                expect(screen.getByTestId("container").textContent).toEqual("Products");

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      })));
      it("should resolve even tho there is the same path in multiple components", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
        var CompA, CompB;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                CompB = function _CompB2() {
                  var _useNavigo8 = useNavigo(),
                      match = _useNavigo8.match;

                  if (match) {
                    // @ts-ignore
                    return /*#__PURE__*/React.createElement("p", null, "About2");
                  }

                  return null;
                };

                CompA = function _CompA3() {
                  var _useNavigo7 = useNavigo(),
                      match = _useNavigo7.match;

                  if (match) {
                    // @ts-ignore
                    return /*#__PURE__*/React.createElement("p", null, "About1");
                  }

                  return null;
                };

                render( /*#__PURE__*/React.createElement("div", {
                  "data-testid": "container"
                }, /*#__PURE__*/React.createElement(Route, {
                  path: "/about",
                  loose: true
                }, /*#__PURE__*/React.createElement(CompA, null)), /*#__PURE__*/React.createElement(Route, {
                  path: "/about",
                  loose: true
                }, /*#__PURE__*/React.createElement(CompB, null))));
                expectContent("");
                _context5.next = 6;
                return navigate("/about");

              case 6:
                expectContent("About1About2");
                _context5.next = 9;
                return navigate("products");

              case 9:
                expectContent("");

              case 10:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      })));
    });
    describe("and when we have links with data-navigo attribute", function () {
      it("should properly navigate to the new route", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6() {
        var CompA, CompB, _render2, getByText;

        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                CompB = function _CompB3() {
                  var _useNavigo9 = useNavigo(),
                      match = _useNavigo9.match;

                  if (match) {
                    // @ts-ignore
                    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "About"), /*#__PURE__*/React.createElement("a", {
                      href: "/",
                      "data-navigo": true
                    }, "home"));
                  }

                  return null;
                };

                CompA = function _CompA4() {
                  return /*#__PURE__*/React.createElement("a", {
                    href: "/about",
                    "data-navigo": true
                  }, "click me");
                };

                configureRouter("/app");
                _render2 = render( /*#__PURE__*/React.createElement("div", {
                  "data-testid": "container"
                }, /*#__PURE__*/React.createElement(CompA, null), /*#__PURE__*/React.createElement(Route, {
                  path: "/about",
                  loose: true
                }, /*#__PURE__*/React.createElement(CompB, null)))), getByText = _render2.getByText;
                expectContent("click me");
                fireEvent.click(getByText("click me"));
                expectContent("click meAbouthome");
                _context6.next = 9;
                return delay();

              case 9:
                fireEvent.click(getByText("home"));
                expectContent("click me");

              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      })));
    });
  });
  describe("when passing a `before` function", function () {
    it("should create a before hook and allow us to send props to useNavigo hook", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8() {
      var Comp;
      return _regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              Comp = function _Comp3() {
                var _useNavigo10 = useNavigo(),
                    match = _useNavigo10.match,
                    myName = _useNavigo10.myName;

                if (match) {
                  return /*#__PURE__*/React.createElement("p", null, "Hello, ", myName);
                }

                if (myName) {
                  return /*#__PURE__*/React.createElement("p", null, "Hey, ", myName);
                }

                return /*#__PURE__*/React.createElement("p", null, "Nope");
              };

              history.pushState({}, "", "/about");
              render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Route, {
                path: "/about",
                loose: true,
                before: /*#__PURE__*/function () {
                  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(done) {
                    return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            done({
                              myName: "Krasimir"
                            });
                            _context7.next = 3;
                            return delay(5);

                          case 3:
                            waitFor(function () {
                              done({
                                myName: "Tsonev"
                              });
                            });
                            _context7.next = 6;
                            return delay(5);

                          case 6:
                            waitFor(function () {
                              done(true);
                            });

                          case 7:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7);
                  }));

                  return function (_x) {
                    return _ref8.apply(this, arguments);
                  };
                }()
              }, /*#__PURE__*/React.createElement(Comp, null))));
              expectContent("Hey, Krasimir");
              _context8.next = 6;
              return delay(7);

            case 6:
              expectContent("Hey, Tsonev");
              _context8.next = 9;
              return delay(20);

            case 9:
              expectContent("Hello, Tsonev");

            case 10:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));
    it("should allow us to block the routing", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10() {
      var Comp;
      return _regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              Comp = function _Comp4() {
                var _useNavigo11 = useNavigo(),
                    match = _useNavigo11.match;

                if (match) {
                  return /*#__PURE__*/React.createElement("p", null, "About");
                }

                return /*#__PURE__*/React.createElement("p", null, "Nope");
              };

              history.pushState({}, "", "/");
              render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Route, {
                path: "/about",
                loose: true,
                before: /*#__PURE__*/function () {
                  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(done) {
                    return _regeneratorRuntime.wrap(function _callee9$(_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            done(false);

                          case 1:
                          case "end":
                            return _context9.stop();
                        }
                      }
                    }, _callee9);
                  }));

                  return function (_x2) {
                    return _ref10.apply(this, arguments);
                  };
                }()
              }, /*#__PURE__*/React.createElement(Comp, null))));
              expectContent("Nope");
              getRouter().navigate("/about");
              expectContent("Nope");
              expect(location.pathname).toEqual("/");

            case 7:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
  });
  describe("when passing `after`", function () {
    it("should create an after hook and allow us to send props to useNavigo hook", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12() {
      var Comp;
      return _regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              Comp = function _Comp5() {
                var _useNavigo12 = useNavigo(),
                    match = _useNavigo12.match,
                    userName = _useNavigo12.userName;

                if (match && userName) {
                  return /*#__PURE__*/React.createElement("p", null, "Hey, ", userName);
                }

                return /*#__PURE__*/React.createElement("p", null, "Nope");
              };

              history.pushState({}, "", "/");
              render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Route, {
                path: "/about",
                loose: true,
                after: /*#__PURE__*/function () {
                  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11(done) {
                    return _regeneratorRuntime.wrap(function _callee11$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            done({
                              userName: "Foo Bar"
                            });

                          case 1:
                          case "end":
                            return _context11.stop();
                        }
                      }
                    }, _callee11);
                  }));

                  return function (_x3) {
                    return _ref12.apply(this, arguments);
                  };
                }()
              }, /*#__PURE__*/React.createElement(Comp, null))));
              expectContent("Nope");
              _context12.next = 6;
              return waitFor(function () {
                getRouter().navigate("/about");
              });

            case 6:
              expectContent("Hey, Foo Bar");

            case 7:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    })));
  });
  describe("when passing `already`", function () {
    it("should create an already hook and allow us to send props to useNavigo hook", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee14() {
      var Comp;
      return _regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              Comp = function _Comp6() {
                var _useNavigo13 = useNavigo(),
                    match = _useNavigo13.match,
                    again = _useNavigo13.again;

                if (match && again) {
                  return /*#__PURE__*/React.createElement("p", null, "Rendering again");
                }

                return /*#__PURE__*/React.createElement("p", null, "Nope");
              };

              history.pushState({}, "", "/");
              render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Route, {
                path: "/about",
                loose: true,
                already: /*#__PURE__*/function () {
                  var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13(done) {
                    return _regeneratorRuntime.wrap(function _callee13$(_context13) {
                      while (1) {
                        switch (_context13.prev = _context13.next) {
                          case 0:
                            done({
                              again: true
                            });

                          case 1:
                          case "end":
                            return _context13.stop();
                        }
                      }
                    }, _callee13);
                  }));

                  return function (_x4) {
                    return _ref14.apply(this, arguments);
                  };
                }()
              }, /*#__PURE__*/React.createElement(Comp, null))));
              expectContent("Nope");
              _context14.next = 6;
              return waitFor(function () {
                getRouter().navigate("/about");
                getRouter().navigate("/about");
              });

            case 6:
              expectContent("Rendering again");

            case 7:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    })));
  });
  describe("when passing a `leave` function", function () {
    it("should create a leave hook and allow us to send props to useNavigo hook", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee16() {
      var Comp;
      return _regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              Comp = function _Comp7() {
                var _useNavigo14 = useNavigo(),
                    match = _useNavigo14.match,
                    leaving = _useNavigo14.leaving;

                if (leaving) {
                  return /*#__PURE__*/React.createElement("p", null, "Leaving...");
                }

                if (match) {
                  return /*#__PURE__*/React.createElement("p", null, "Match");
                }

                return /*#__PURE__*/React.createElement("p", null, "Nope");
              };

              history.pushState({}, "", "/");
              render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Route, {
                path: "/about",
                loose: true,
                leave: /*#__PURE__*/function () {
                  var _ref16 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee15(done) {
                    return _regeneratorRuntime.wrap(function _callee15$(_context15) {
                      while (1) {
                        switch (_context15.prev = _context15.next) {
                          case 0:
                            done({
                              leaving: true
                            });
                            _context15.next = 3;
                            return delay(10);

                          case 3:
                            waitFor(function () {
                              done({
                                leaving: false
                              });
                              done(true);
                            });

                          case 4:
                          case "end":
                            return _context15.stop();
                        }
                      }
                    }, _callee15);
                  }));

                  return function (_x5) {
                    return _ref16.apply(this, arguments);
                  };
                }()
              }, /*#__PURE__*/React.createElement(Comp, null))));
              expectContent("Nope");
              _context16.next = 6;
              return waitFor(function () {
                getRouter().navigate("/about");
              });

            case 6:
              expectContent("Match");
              _context16.next = 9;
              return waitFor(function () {
                getRouter().navigate("/nah");
              });

            case 9:
              expectContent("Leaving...");
              _context16.next = 12;
              return delay(20);

            case 12:
              expectContent("Nope");

            case 13:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    })));
    it("should allow us to block the routing", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee18() {
      var Comp;
      return _regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              Comp = function _Comp8() {
                var _useNavigo15 = useNavigo(),
                    match = _useNavigo15.match,
                    leaving = _useNavigo15.leaving;

                if (leaving) {
                  return /*#__PURE__*/React.createElement("p", null, "Leaving...");
                }

                if (match) {
                  return /*#__PURE__*/React.createElement("p", null, "Match");
                }

                return /*#__PURE__*/React.createElement("p", null, "Nope");
              };

              history.pushState({}, "", "/");
              render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Route, {
                path: "/about",
                loose: true,
                leave: /*#__PURE__*/function () {
                  var _ref18 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee17(done) {
                    return _regeneratorRuntime.wrap(function _callee17$(_context17) {
                      while (1) {
                        switch (_context17.prev = _context17.next) {
                          case 0:
                            done(false);

                          case 1:
                          case "end":
                            return _context17.stop();
                        }
                      }
                    }, _callee17);
                  }));

                  return function (_x6) {
                    return _ref18.apply(this, arguments);
                  };
                }()
              }, /*#__PURE__*/React.createElement(Comp, null))));
              expectContent("Nope");
              _context18.next = 6;
              return waitFor(function () {
                getRouter().navigate("/about");
              });

            case 6:
              expectContent("Match");
              _context18.next = 9;
              return waitFor(function () {
                getRouter().navigate("/nah");
              });

            case 9:
              expectContent("Match");
              expect(location.pathname).toEqual("/about");

            case 11:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18);
    })));
  });
});