/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.14.0 - 2016-09-30
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.dateparser","ui.bootstrap.position","ui.bootstrap.datepicker","ui.bootstrap.dropdown","ui.bootstrap.stackedMap","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]);
angular.module('ui.bootstrap.collapse', [])

  .directive('uibCollapse', ['$animate', '$injector', function($animate, $injector) {
    var $animateCss = $injector.has('$animateCss') ? $injector.get('$animateCss') : null;
    return {
      link: function(scope, element, attrs) {
        function expand() {
          element.removeClass('collapse')
            .addClass('collapsing')
            .attr('aria-expanded', true)
            .attr('aria-hidden', false);

          if ($animateCss) {
            $animateCss(element, {
              addClass: 'in',
              easing: 'ease',
              to: { height: element[0].scrollHeight + 'px' }
            }).start().done(expandDone);
          } else {
            $animate.addClass(element, 'in', {
              to: { height: element[0].scrollHeight + 'px' }
            }).then(expandDone);
          }
        }

        function expandDone() {
          element.removeClass('collapsing')
            .addClass('collapse')
            .css({height: 'auto'});
        }

        function collapse() {
          if (!element.hasClass('collapse') && !element.hasClass('in')) {
            return collapseDone();
          }

          element
            // IMPORTANT: The height must be set before adding "collapsing" class.
            // Otherwise, the browser attempts to animate from height 0 (in
            // collapsing class) to the given height here.
            .css({height: element[0].scrollHeight + 'px'})
            // initially all panel collapse have the collapse class, this removal
            // prevents the animation from jumping to collapsed state
            .removeClass('collapse')
            .addClass('collapsing')
            .attr('aria-expanded', false)
            .attr('aria-hidden', true);

          if ($animateCss) {
            $animateCss(element, {
              removeClass: 'in',
              to: {height: '0'}
            }).start().done(collapseDone);
          } else {
            $animate.removeClass(element, 'in', {
              to: {height: '0'}
            }).then(collapseDone);
          }
        }

        function collapseDone() {
          element.css({height: '0'}); // Required so that collapse works when animation is disabled
          element.removeClass('collapsing')
            .addClass('collapse');
        }

        scope.$watch(attrs.uibCollapse, function(shouldCollapse) {
          if (shouldCollapse) {
            collapse();
          } else {
            expand();
          }
        });
      }
    };
  }]);

/* Deprecated collapse below */

angular.module('ui.bootstrap.collapse')

  .value('$collapseSuppressWarning', false)

  .directive('collapse', ['$animate', '$injector', '$log', '$collapseSuppressWarning', function($animate, $injector, $log, $collapseSuppressWarning) {
    var $animateCss = $injector.has('$animateCss') ? $injector.get('$animateCss') : null;
    return {
      link: function(scope, element, attrs) {
        if (!$collapseSuppressWarning) {
          $log.warn('collapse is now deprecated. Use uib-collapse instead.');
        }

        function expand() {
          element.removeClass('collapse')
            .addClass('collapsing')
            .attr('aria-expanded', true)
            .attr('aria-hidden', false);

          if ($animateCss) {
            $animateCss(element, {
              addClass: 'in',
              easing: 'ease',
              to: { height: element[0].scrollHeight + 'px' }
            }).start().done(expandDone);
          } else {
            $animate.addClass(element, 'in', {
              to: { height: element[0].scrollHeight + 'px' }
            }).then(expandDone);
          }
        }

        function expandDone() {
          element.removeClass('collapsing')
            .addClass('collapse')
            .css({height: 'auto'});
        }

        function collapse() {
          if (!element.hasClass('collapse') && !element.hasClass('in')) {
            return collapseDone();
          }

          element
            // IMPORTANT: The height must be set before adding "collapsing" class.
            // Otherwise, the browser attempts to animate from height 0 (in
            // collapsing class) to the given height here.
            .css({height: element[0].scrollHeight + 'px'})
            // initially all panel collapse have the collapse class, this removal
            // prevents the animation from jumping to collapsed state
            .removeClass('collapse')
            .addClass('collapsing')
            .attr('aria-expanded', false)
            .attr('aria-hidden', true);

          if ($animateCss) {
            $animateCss(element, {
              removeClass: 'in',
              to: {height: '0'}
            }).start().done(collapseDone);
          } else {
            $animate.removeClass(element, 'in', {
              to: {height: '0'}
            }).then(collapseDone);
          }
        }

        function collapseDone() {
          element.css({height: '0'}); // Required so that collapse works when animation is disabled
          element.removeClass('collapsing')
            .addClass('collapse');
        }

        scope.$watch(attrs.collapse, function(shouldCollapse) {
          if (shouldCollapse) {
            collapse();
          } else {
            expand();
          }
        });
      }
    };
  }]);

angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse'])

.constant('uibAccordionConfig', {
  closeOthers: true
})

.controller('UibAccordionController', ['$scope', '$attrs', 'uibAccordionConfig', function($scope, $attrs, accordionConfig) {
  // This array keeps track of the accordion groups
  this.groups = [];

  // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
  this.closeOthers = function(openGroup) {
    var closeOthers = angular.isDefined($attrs.closeOthers) ?
      $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
    if (closeOthers) {
      angular.forEach(this.groups, function(group) {
        if (group !== openGroup) {
          group.isOpen = false;
        }
      });
    }
  };

  // This is called from the accordion-group directive to add itself to the accordion
  this.addGroup = function(groupScope) {
    var that = this;
    this.groups.push(groupScope);

    groupScope.$on('$destroy', function(event) {
      that.removeGroup(groupScope);
    });
  };

  // This is called from the accordion-group directive when to remove itself
  this.removeGroup = function(group) {
    var index = this.groups.indexOf(group);
    if (index !== -1) {
      this.groups.splice(index, 1);
    }
  };

}])

// The accordion directive simply sets up the directive controller
// and adds an accordion CSS class to itself element.
.directive('uibAccordion', function() {
  return {
    controller: 'UibAccordionController',
    controllerAs: 'accordion',
    transclude: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/accordion/accordion.html';
    }
  };
})

// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
.directive('uibAccordionGroup', function() {
  return {
    require: '^uibAccordion',         // We need this directive to be inside an accordion
    transclude: true,              // It transcludes the contents of the directive into the template
    replace: true,                // The element containing the directive will be replaced with the template
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/accordion/accordion-group.html';
    },
    scope: {
      heading: '@',               // Interpolate the heading attribute onto this scope
      isOpen: '=?',
      isDisabled: '=?'
    },
    controller: function() {
      this.setHeading = function(element) {
        this.heading = element;
      };
    },
    link: function(scope, element, attrs, accordionCtrl) {
      accordionCtrl.addGroup(scope);

      scope.openClass = attrs.openClass || 'panel-open';
      scope.panelClass = attrs.panelClass;
      scope.$watch('isOpen', function(value) {
        element.toggleClass(scope.openClass, !!value);
        if (value) {
          accordionCtrl.closeOthers(scope);
        }
      });

      scope.toggleOpen = function($event) {
        if (!scope.isDisabled) {
          if (!$event || $event.which === 32) {
            scope.isOpen = !scope.isOpen;
          }
        }
      };
    }
  };
})

// Use accordion-heading below an accordion-group to provide a heading containing HTML
.directive('uibAccordionHeading', function() {
  return {
    transclude: true,   // Grab the contents to be used as the heading
    template: '',       // In effect remove this element!
    replace: true,
    require: '^uibAccordionGroup',
    link: function(scope, element, attrs, accordionGroupCtrl, transclude) {
      // Pass the heading to the accordion-group controller
      // so that it can be transcluded into the right place in the template
      // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
      accordionGroupCtrl.setHeading(transclude(scope, angular.noop));
    }
  };
})

// Use in the accordion-group template to indicate where you want the heading to be transcluded
// You must provide the property on the accordion-group controller that will hold the transcluded element
.directive('uibAccordionTransclude', function() {
  return {
    require: ['?^uibAccordionGroup', '?^accordionGroup'],
    link: function(scope, element, attrs, controller) {
      controller = controller[0] ? controller[0] : controller[1]; // Delete after we remove deprecation
      scope.$watch(function() { return controller[attrs.uibAccordionTransclude]; }, function(heading) {
        if (heading) {
          element.find('span').html('');
          element.find('span').append(heading);
        }
      });
    }
  };
});

/* Deprecated accordion below */

angular.module('ui.bootstrap.accordion')

  .value('$accordionSuppressWarning', false)

  .directive('accordion', ['$log', '$accordionSuppressWarning', function($log, $accordionSuppressWarning) {
    return {
      restrict: 'EA',
      controller: 'UibAccordionController',
      controllerAs: 'accordion',
      transclude: true,
      replace: false,
      templateUrl: function(element, attrs) {
        return attrs.templateUrl || 'template/accordion/accordion.html';
      },
      link: function() {
        if (!$accordionSuppressWarning) {
          $log.warn('accordion is now deprecated. Use uib-accordion instead.');
        }
      }
    };
  }])

  .directive('accordionGroup', ['$log', '$accordionSuppressWarning', function($log, $accordionSuppressWarning) {
    return {
      require: '^accordion',         // We need this directive to be inside an accordion
      restrict: 'EA',
      transclude: true,              // It transcludes the contents of the directive into the template
      replace: true,                // The element containing the directive will be replaced with the template
      templateUrl: function(element, attrs) {
        return attrs.templateUrl || 'template/accordion/accordion-group.html';
      },
      scope: {
        heading: '@',               // Interpolate the heading attribute onto this scope
        isOpen: '=?',
        isDisabled: '=?'
      },
      controller: function() {
        this.setHeading = function(element) {
          this.heading = element;
        };
      },
      link: function(scope, element, attrs, accordionCtrl) {
        if (!$accordionSuppressWarning) {
          $log.warn('accordion-group is now deprecated. Use uib-accordion-group instead.');
        }

        accordionCtrl.addGroup(scope);

        scope.openClass = attrs.openClass || 'panel-open';
        scope.panelClass = attrs.panelClass;
        scope.$watch('isOpen', function(value) {
          element.toggleClass(scope.openClass, !!value);
          if (value) {
            accordionCtrl.closeOthers(scope);
          }
        });

        scope.toggleOpen = function($event) {
          if (!scope.isDisabled) {
            if (!$event || $event.which === 32) {
              scope.isOpen = !scope.isOpen;
            }
          }
        };
      }
    };
  }])

  .directive('accordionHeading', ['$log', '$accordionSuppressWarning', function($log, $accordionSuppressWarning) {
    return {
      restrict: 'EA',
      transclude: true,   // Grab the contents to be used as the heading
      template: '',       // In effect remove this element!
      replace: true,
      require: '^accordionGroup',
      link: function(scope, element, attr, accordionGroupCtrl, transclude) {
        if (!$accordionSuppressWarning) {
          $log.warn('accordion-heading is now deprecated. Use uib-accordion-heading instead.');
        }
        // Pass the heading to the accordion-group controller
        // so that it can be transcluded into the right place in the template
        // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
        accordionGroupCtrl.setHeading(transclude(scope, angular.noop));
      }
    };
  }])

  .directive('accordionTransclude', ['$log', '$accordionSuppressWarning', function($log, $accordionSuppressWarning) {
    return {
      require: '^accordionGroup',
      link: function(scope, element, attr, controller) {
        if (!$accordionSuppressWarning) {
          $log.warn('accordion-transclude is now deprecated. Use uib-accordion-transclude instead.');
        }

        scope.$watch(function() { return controller[attr.accordionTransclude]; }, function(heading) {
          if (heading) {
            element.find('span').html('');
            element.find('span').append(heading);
          }
        });
      }
    };
  }]);


angular.module('ui.bootstrap.alert', [])

.controller('UibAlertController', ['$scope', '$attrs', '$timeout', function($scope, $attrs, $timeout) {
  $scope.closeable = !!$attrs.close;

  if (angular.isDefined($attrs.dismissOnTimeout)) {
    $timeout(function() {
      $scope.close();
    }, parseInt($attrs.dismissOnTimeout, 10));
  }
}])

.directive('uibAlert', function() {
  return {
    controller: 'UibAlertController',
    controllerAs: 'alert',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/alert/alert.html';
    },
    transclude: true,
    replace: true,
    scope: {
      type: '@',
      close: '&'
    }
  };
});

/* Deprecated alert below */

angular.module('ui.bootstrap.alert')

  .value('$alertSuppressWarning', false)

  .directive('alert', ['$log', '$alertSuppressWarning', function($log, $alertSuppressWarning) {
    return {
      controller: 'UibAlertController',
      controllerAs: 'alert',
      templateUrl: function(element, attrs) {
        return attrs.templateUrl || 'template/alert/alert.html';
      },
      transclude: true,
      replace: true,
      scope: {
        type: '@',
        close: '&'
      },
      link: function() {
        if (!$alertSuppressWarning) {
          $log.warn('alert is now deprecated. Use uib-alert instead.');
        }
      }
    };
  }]);

angular.module('ui.bootstrap.buttons', [])

.constant('buttonConfig', {
  activeClass: 'active',
  toggleEvent: 'click'
})

.controller('ButtonsController', ['buttonConfig', function(buttonConfig) {
  this.activeClass = buttonConfig.activeClass || 'active';
  this.toggleEvent = buttonConfig.toggleEvent || 'click';
}])

.directive('btnRadio', function() {
  return {
    require: ['btnRadio', 'ngModel'],
    controller: 'ButtonsController',
    controllerAs: 'buttons',
    link: function(scope, element, attrs, ctrls) {
      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      element.find('input').css({display: 'none'});

      //model -> UI
      ngModelCtrl.$render = function() {
        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio)));
      };

      //ui->model
      element.bind(buttonsCtrl.toggleEvent, function() {
        if (attrs.disabled) {
          return;
        }

        var isActive = element.hasClass(buttonsCtrl.activeClass);

        if (!isActive || angular.isDefined(attrs.uncheckable)) {
          scope.$apply(function() {
            ngModelCtrl.$setViewValue(isActive ? null : scope.$eval(attrs.btnRadio));
            ngModelCtrl.$render();
          });
        }
      });
    }
  };
})

.directive('btnCheckbox', ['$document', function($document) {
  return {
    require: ['btnCheckbox', 'ngModel'],
    controller: 'ButtonsController',
    controllerAs: 'button',
    link: function(scope, element, attrs, ctrls) {
      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      element.find('input').css({display: 'none'});

      function getTrueValue() {
        return getCheckboxValue(attrs.btnCheckboxTrue, true);
      }

      function getFalseValue() {
        return getCheckboxValue(attrs.btnCheckboxFalse, false);
      }

      function getCheckboxValue(attributeValue, defaultValue) {
        var val = scope.$eval(attributeValue);
        return angular.isDefined(val) ? val : defaultValue;
      }

      //model -> UI
      ngModelCtrl.$render = function() {
        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
      };

      //ui->model
      element.bind(buttonsCtrl.toggleEvent, function() {
        if (attrs.disabled) {
          return;
        }

        scope.$apply(function() {
          ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue());
          ngModelCtrl.$render();
        });
      });

      //accessibility
      element.on('keypress', function(e) {
        if (attrs.disabled || e.which !== 32 || $document[0].activeElement !== element[0]) {
          return;
        }

        scope.$apply(function() {
          ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue());
          ngModelCtrl.$render();
        });
      });
    }
  };
}]);

/**
* @ngdoc overview
* @name ui.bootstrap.carousel
*
* @description
* AngularJS version of an image carousel.
*
*/
angular.module('ui.bootstrap.carousel', [])
.controller('CarouselController', ['$scope', '$element', '$interval', '$animate', function($scope, $element, $interval, $animate) {
  var self = this,
    slides = self.slides = $scope.slides = [],
    NEW_ANIMATE = angular.version.minor >= 4,
    NO_TRANSITION = 'uib-noTransition',
    SLIDE_DIRECTION = 'uib-slideDirection',
    currentIndex = -1,
    currentInterval, isPlaying;
  self.currentSlide = null;

  var destroyed = false;
  /* direction: "prev" or "next" */
  self.select = $scope.select = function(nextSlide, direction) {
    var nextIndex = $scope.indexOfSlide(nextSlide);
    //Decide direction if it's not given
    if (direction === undefined) {
      direction = nextIndex > self.getCurrentIndex() ? 'next' : 'prev';
    }
    //Prevent this user-triggered transition from occurring if there is already one in progress
    if (nextSlide && nextSlide !== self.currentSlide) {
      goNext(nextSlide, nextIndex, direction);
    }
  };

  function goNext(slide, index, direction) {
    // Scope has been destroyed, stop here.
    if (destroyed) { return; }

    angular.extend(slide, {direction: direction, active: true});
    angular.extend(self.currentSlide || {}, {direction: direction, active: false});
    if ($animate.enabled() && !$scope.noTransition && !$scope.$currentTransition &&
      slide.$element && self.slides.length > 1) {
      slide.$element.data(SLIDE_DIRECTION, slide.direction);
      if (self.currentSlide && self.currentSlide.$element) {
        self.currentSlide.$element.data(SLIDE_DIRECTION, slide.direction);
      }

      $scope.$currentTransition = true;
      if (NEW_ANIMATE) {
        $animate.on('addClass', slide.$element, function(element, phase) {
          if (phase === 'close') {
            $scope.$currentTransition = null;
            $animate.off('addClass', element);
          }
        });
      } else {
        slide.$element.one('$animate:close', function closeFn() {
          $scope.$currentTransition = null;
        });
      }
    }

    self.currentSlide = slide;
    currentIndex = index;

    //every time you change slides, reset the timer
    restartTimer();
  }

  $scope.$on('$destroy', function() {
    destroyed = true;
  });

  function getSlideByIndex(index) {
    if (angular.isUndefined(slides[index].index)) {
      return slides[index];
    }
    var i, len = slides.length;
    for (i = 0; i < slides.length; ++i) {
      if (slides[i].index == index) {
        return slides[i];
      }
    }
  }

  self.getCurrentIndex = function() {
    if (self.currentSlide && angular.isDefined(self.currentSlide.index)) {
      return +self.currentSlide.index;
    }
    return currentIndex;
  };

  /* Allow outside people to call indexOf on slides array */
  $scope.indexOfSlide = function(slide) {
    return angular.isDefined(slide.index) ? +slide.index : slides.indexOf(slide);
  };

  $scope.next = function() {
    var newIndex = (self.getCurrentIndex() + 1) % slides.length;

    if (newIndex === 0 && $scope.noWrap()) {
      $scope.pause();
      return;
    }

    $scope.swipe({index: newIndex});
    return self.select(getSlideByIndex(newIndex), 'next');
  };

  $scope.prev = function() {
    var newIndex = self.getCurrentIndex() - 1 < 0 ? slides.length - 1 : self.getCurrentIndex() - 1;

    if ($scope.noWrap() && newIndex === slides.length - 1) {
      $scope.pause();
      return;
    }

    $scope.swipe({index: newIndex});
    return self.select(getSlideByIndex(newIndex), 'prev');
  };

  $scope.isActive = function(slide) {
     return self.currentSlide === slide;
  };

  $scope.$watch('interval', restartTimer);
  $scope.$on('$destroy', resetTimer);

  function restartTimer() {
    resetTimer();
    var interval = +$scope.interval;
    if (!isNaN(interval) && interval > 0) {
      currentInterval = $interval(timerFn, interval);
    }
  }

  function resetTimer() {
    if (currentInterval) {
      $interval.cancel(currentInterval);
      currentInterval = null;
    }
  }

  function timerFn() {
    var interval = +$scope.interval;
    if (isPlaying && !isNaN(interval) && interval > 0 && slides.length) {
      $scope.next();
    } else {
      $scope.pause();
    }
  }

  $scope.play = function() {
    if (!isPlaying) {
      isPlaying = true;
      restartTimer();
    }
  };
  $scope.pause = function() {
    if (!$scope.noPause) {
      isPlaying = false;
      resetTimer();
    }
  };

  self.addSlide = function(slide, element) {
    slide.$element = element;
    slides.push(slide);
    //if this is the first slide or the slide is set to active, select it
    if(slides.length === 1 || slide.active) {
      self.select(slides[slides.length - 1]);
      if (slides.length === 1) {
        $scope.play();
      }
    } else {
      slide.active = false;
    }
  };

  self.removeSlide = function(slide) {
    if (angular.isDefined(slide.index)) {
      slides.sort(function(a, b) {
        return +a.index > +b.index;
      });
    }
    //get the index of the slide inside the carousel
    var index = slides.indexOf(slide);
    slides.splice(index, 1);
    if (slides.length > 0 && slide.active) {
      if (index >= slides.length) {
        self.select(slides[index - 1]);
      } else {
        self.select(slides[index]);
      }
    } else if (currentIndex > index) {
      currentIndex--;
    }
    
    //clean the currentSlide when no more slide
    if (slides.length === 0) {
      self.currentSlide = null;
    }
  };

  $scope.$watch('noTransition', function(noTransition) {
    $element.data(NO_TRANSITION, noTransition);
  });

}])

/**
 * @ngdoc directive
 * @name ui.bootstrap.carousel.directive:carousel
 * @restrict EA
 *
 * @description
 * Carousel is the outer container for a set of image 'slides' to showcase.
 *
 * @param {number=} interval The time, in milliseconds, that it will take the carousel to go to the next slide.
 * @param {boolean=} noTransition Whether to disable transitions on the carousel.
 * @param {boolean=} noPause Whether to disable pausing on the carousel (by default, the carousel interval pauses on hover).
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <carousel>
      <slide>
        <img src="http://placekitten.com/150/150" style="margin:auto;">
        <div class="carousel-caption">
          <p>Beautiful!</p>
        </div>
      </slide>
      <slide>
        <img src="http://placekitten.com/100/150" style="margin:auto;">
        <div class="carousel-caption">
          <p>D'aww!</p>
        </div>
      </slide>
    </carousel>
  </file>
  <file name="demo.css">
    .carousel-indicators {
      top: auto;
      bottom: 15px;
    }
  </file>
</example>
 */
.directive('carousel', [function() {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    controller: 'CarouselController',
    controllerAs: 'carousel',
    require: 'carousel',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/carousel/carousel.html';
    },
    scope: {
      interval: '=',
      noTransition: '=',
      noPause: '=',
      noWrap: '&',
      swipe: '&'
    }
  };
}])

/**
 * @ngdoc directive
 * @name ui.bootstrap.carousel.directive:slide
 * @restrict EA
 *
 * @description
 * Creates a slide inside a {@link ui.bootstrap.carousel.directive:carousel carousel}.  Must be placed as a child of a carousel element.
 *
 * @param {boolean=} active Model binding, whether or not this slide is currently active.
 * @param {number=} index The index of the slide. The slides will be sorted by this parameter.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
<div ng-controller="CarouselDemoCtrl">
  <carousel>
    <slide ng-repeat="slide in slides" active="slide.active" index="$index">
      <img ng-src="{{slide.image}}" style="margin:auto;">
      <div class="carousel-caption">
        <h4>Slide {{$index}}</h4>
        <p>{{slide.text}}</p>
      </div>
    </slide>
  </carousel>
  Interval, in milliseconds: <input type="number" ng-model="myInterval">
  <br />Enter a negative number to stop the interval.
</div>
  </file>
  <file name="script.js">
function CarouselDemoCtrl($scope) {
  $scope.myInterval = 5000;
}
  </file>
  <file name="demo.css">
    .carousel-indicators {
      top: auto;
      bottom: 15px;
    }
  </file>
</example>
*/

.directive('slide', function() {
  return {
    require: '^carousel',
    restrict: 'EA',
    transclude: true,
    replace: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/carousel/slide.html';
    },
    scope: {
      active: '=?',
      actual: '=?',
      index: '=?',
      initIndex: '=?'
    },
    link: function (scope, element, attrs, carouselCtrl) {
      carouselCtrl.addSlide(scope, element);
      //when the scope is destroyed then remove the slide from the current slides array
      scope.$on('$destroy', function() {
        carouselCtrl.removeSlide(scope);
      });

      scope.$watch('active', function(active) {
        if (active) {
          carouselCtrl.select(scope);
        }
      });

      if (scope.index === scope.initIndex) {
        carouselCtrl.select(scope);
      }
    }
  };
})

.animation('.item', [
         '$injector', '$animate',
function ($injector, $animate) {
  var NO_TRANSITION = 'uib-noTransition',
    SLIDE_DIRECTION = 'uib-slideDirection',
    $animateCss = null;

  if ($injector.has('$animateCss')) {
    $animateCss = $injector.get('$animateCss');
  }

  function removeClass(element, className, callback) {
    element.removeClass(className);
    if (callback) {
      callback();
    }
  }

  return {
    beforeAddClass: function(element, className, done) {
      // Due to transclusion, noTransition property is on parent's scope
      if (className == 'active' && element.parent() &&
          !element.parent().data(NO_TRANSITION)) {
        var stopped = false;
        var direction = element.data(SLIDE_DIRECTION);
        var directionClass = direction == 'next' ? 'left' : 'right';
        var removeClassFn = removeClass.bind(this, element,
          directionClass + ' ' + direction, done);
        element.addClass(direction);

        if ($animateCss) {
          $animateCss(element, {addClass: directionClass})
            .start()
            .done(removeClassFn);
        } else {
          $animate.addClass(element, directionClass).then(function () {
            if (!stopped) {
              removeClassFn();
            }
            done();
          });
        }

        return function () {
          stopped = true;
        };
      }
      done();
    },
    beforeRemoveClass: function (element, className, done) {
      // Due to transclusion, noTransition property is on parent's scope
      if (className === 'active' && element.parent() &&
          !element.parent().data(NO_TRANSITION)) {
        var stopped = false;
        var direction = element.data(SLIDE_DIRECTION);
        var directionClass = direction == 'next' ? 'left' : 'right';
        var removeClassFn = removeClass.bind(this, element, directionClass, done);

        if ($animateCss) {
          $animateCss(element, {addClass: directionClass})
            .start()
            .done(removeClassFn);
        } else {
          $animate.addClass(element, directionClass).then(function() {
            if (!stopped) {
              removeClassFn();
            }
            done();
          });
        }
        return function() {
          stopped = true;
        };
      }
      done();
    }
  };
}]);

angular.module('ui.bootstrap.dateparser', [])

.service('dateParser', ['$log', '$locale', 'orderByFilter', function($log, $locale, orderByFilter) {
  // Pulled from https://github.com/mbostock/d3/blob/master/src/format/requote.js
  var SPECIAL_CHARACTERS_REGEXP = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

  var localeId;
  var formatCodeToRegex;

  this.init = function() {
    localeId = $locale.id;

    this.parsers = {};

    formatCodeToRegex = {
      'yyyy': {
        regex: '\\d{4}',
        apply: function(value) { this.year = +value; }
      },
      'yy': {
        regex: '\\d{2}',
        apply: function(value) { this.year = +value + 2000; }
      },
      'y': {
        regex: '\\d{1,4}',
        apply: function(value) { this.year = +value; }
      },
      'MMMM': {
        regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
        apply: function(value) { this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value); }
      },
      'MMM': {
        regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
        apply: function(value) { this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value); }
      },
      'MM': {
        regex: '0[1-9]|1[0-2]',
        apply: function(value) { this.month = value - 1; }
      },
      'M': {
        regex: '[1-9]|1[0-2]',
        apply: function(value) { this.month = value - 1; }
      },
      'dd': {
        regex: '[0-2][0-9]{1}|3[0-1]{1}',
        apply: function(value) { this.date = +value; }
      },
      'd': {
        regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
        apply: function(value) { this.date = +value; }
      },
      'EEEE': {
        regex: $locale.DATETIME_FORMATS.DAY.join('|')
      },
      'EEE': {
        regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|')
      },
      'HH': {
        regex: '(?:0|1)[0-9]|2[0-3]',
        apply: function(value) { this.hours = +value; }
      },
      'hh': {
        regex: '0[0-9]|1[0-2]',
        apply: function(value) { this.hours = +value; }
      },
      'H': {
        regex: '1?[0-9]|2[0-3]',
        apply: function(value) { this.hours = +value; }
      },
      'h': {
        regex: '[0-9]|1[0-2]',
        apply: function(value) { this.hours = +value; }
      },
      'mm': {
        regex: '[0-5][0-9]',
        apply: function(value) { this.minutes = +value; }
      },
      'm': {
        regex: '[0-9]|[1-5][0-9]',
        apply: function(value) { this.minutes = +value; }
      },
      'sss': {
        regex: '[0-9][0-9][0-9]',
        apply: function(value) { this.milliseconds = +value; }
      },
      'ss': {
        regex: '[0-5][0-9]',
        apply: function(value) { this.seconds = +value; }
      },
      's': {
        regex: '[0-9]|[1-5][0-9]',
        apply: function(value) { this.seconds = +value; }
      },
      'a': {
        regex: $locale.DATETIME_FORMATS.AMPMS.join('|'),
        apply: function(value) {
          if (this.hours === 12) {
            this.hours = 0;
          }

          if (value === 'PM') {
            this.hours += 12;
          }
        }
      }
    };
  };

  this.init();

  function createParser(format) {
    var map = [], regex = format.split('');

    angular.forEach(formatCodeToRegex, function(data, code) {
      var index = format.indexOf(code);

      if (index > -1) {
        format = format.split('');

        regex[index] = '(' + data.regex + ')';
        format[index] = '$'; // Custom symbol to define consumed part of format
        for (var i = index + 1, n = index + code.length; i < n; i++) {
          regex[i] = '';
          format[i] = '$';
        }
        format = format.join('');

        map.push({ index: index, apply: data.apply });
      }
    });

    return {
      regex: new RegExp('^' + regex.join('') + '$'),
      map: orderByFilter(map, 'index')
    };
  }

  this.parse = function(input, format, baseDate) {
    if (!angular.isString(input) || !format) {
      return input;
    }

    format = $locale.DATETIME_FORMATS[format] || format;
    format = format.replace(SPECIAL_CHARACTERS_REGEXP, '\\$&');

    if ($locale.id !== localeId) {
      this.init();
    }

    if (!this.parsers[format]) {
      this.parsers[format] = createParser(format);
    }

    var parser = this.parsers[format],
        regex = parser.regex,
        map = parser.map,
        results = input.match(regex);

    if (results && results.length) {
      var fields, dt;
      if (angular.isDate(baseDate) && !isNaN(baseDate.getTime())) {
        fields = {
          year: baseDate.getFullYear(),
          month: baseDate.getMonth(),
          date: baseDate.getDate(),
          hours: baseDate.getHours(),
          minutes: baseDate.getMinutes(),
          seconds: baseDate.getSeconds(),
          milliseconds: baseDate.getMilliseconds()
        };
      } else {
        if (baseDate) {
          $log.warn('dateparser:', 'baseDate is not a valid date');
        }
        fields = { year: 1900, month: 0, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
      }

      for (var i = 1, n = results.length; i < n; i++) {
        var mapper = map[i-1];
        if (mapper.apply) {
          mapper.apply.call(fields, results[i]);
        }
      }

      if (isValid(fields.year, fields.month, fields.date)) {
        dt = new Date(fields.year, fields.month, fields.date,
          fields.hours, fields.minutes, fields.seconds,
          fields.milliseconds || 0);
      }

      return dt;
    }
  };

  // Check if date is valid for specific month (and year for February).
  // Month: 0 = Jan, 1 = Feb, etc
  function isValid(year, month, date) {
    if (date < 1) {
      return false;
    }

    if (month === 1 && date > 28) {
      return date === 29 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    }

    if (month === 3 || month === 5 || month === 8 || month === 10) {
      return date < 31;
    }

    return true;
  }
}]);

angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$position', ['$document', '$window', function($document, $window) {
    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, 'position') || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function(element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function(element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function(element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
        };
      },

      /**
       * Provides coordinates for the targetEl in relation to hostEl
       */
      positionElements: function(hostEl, targetEl, positionStr, appendToBody) {
        var positionStrParts = positionStr.split('-');
        var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

        var hostElPos,
          targetElWidth,
          targetElHeight,
          targetElPos;

        hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

        targetElWidth = targetEl.prop('offsetWidth');
        targetElHeight = targetEl.prop('offsetHeight');

        var shiftWidth = {
          center: function() {
            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
          },
          left: function() {
            return hostElPos.left;
          },
          right: function() {
            return hostElPos.left + hostElPos.width;
          }
        };

        var shiftHeight = {
          center: function() {
            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
          },
          top: function() {
            return hostElPos.top;
          },
          bottom: function() {
            return hostElPos.top + hostElPos.height;
          }
        };

        switch (pos0) {
          case 'right':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: shiftWidth[pos0]()
            };
            break;
          case 'left':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: hostElPos.left - targetElWidth
            };
            break;
          case 'bottom':
            targetElPos = {
              top: shiftHeight[pos0](),
              left: shiftWidth[pos1]()
            };
            break;
          default:
            targetElPos = {
              top: hostElPos.top - targetElHeight,
              left: shiftWidth[pos1]()
            };
            break;
        }

        return targetElPos;
      }
    };
  }]);

angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.position'])

.constant('datepickerConfig', {
  dayFormat: 'dd',
  monthFormat: 'MMMM',
  yearFormat: 'yyyy',
  dayHeaderFormat: 'EEE',
  dayTitleFormat: 'MMMM yyyy',
  monthTitleFormat: 'yyyy',
  showWeeks: true,
  startingDay: 0,
  yearRange: 20,
  minDate: null,
  maxDate: null
})

.controller('DatepickerController', ['$scope', '$attrs', 'dateFilter', 'datepickerConfig', function($scope, $attrs, dateFilter, dtConfig) {
  var format = {
    day:        getValue($attrs.dayFormat,        dtConfig.dayFormat),
    month:      getValue($attrs.monthFormat,      dtConfig.monthFormat),
    year:       getValue($attrs.yearFormat,       dtConfig.yearFormat),
    dayHeader:  getValue($attrs.dayHeaderFormat,  dtConfig.dayHeaderFormat),
    dayTitle:   getValue($attrs.dayTitleFormat,   dtConfig.dayTitleFormat),
    monthTitle: getValue($attrs.monthTitleFormat, dtConfig.monthTitleFormat)
  },
  startingDay = getValue($attrs.startingDay,      dtConfig.startingDay),
  yearRange =   getValue($attrs.yearRange,        dtConfig.yearRange);

  this.minDate = dtConfig.minDate ? new Date(dtConfig.minDate) : null;
  this.maxDate = dtConfig.maxDate ? new Date(dtConfig.maxDate) : null;

  function getValue(value, defaultValue) {
    return angular.isDefined(value) ? $scope.$parent.$eval(value) : defaultValue;
  }

  function getDaysInMonth( year, month ) {
    return new Date(year, month, 0).getDate();
  }

  function getDates(startDate, n) {
    var dates = new Array(n);
    var current = startDate, i = 0;
    while (i < n) {
      dates[i++] = new Date(current);
      current.setDate( current.getDate() + 1 );
    }
    return dates;
  }

  function makeDate(date, format, isSelected, isSecondary) {
    return { date: date, label: dateFilter(date, format), selected: !!isSelected, secondary: !!isSecondary };
  }

  this.modes = [
    {
      name: 'day',
      getVisibleDates: function(date, selected) {
        var year = date.getFullYear(), month = date.getMonth(), firstDayOfMonth = new Date(year, month, 1);
        var difference = startingDay - firstDayOfMonth.getDay(),
        numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
        firstDate = new Date(firstDayOfMonth), numDates = 0;

        if ( numDisplayedFromPreviousMonth > 0 ) {
          firstDate.setDate( - numDisplayedFromPreviousMonth + 1 );
          numDates += numDisplayedFromPreviousMonth; // Previous
        }
        numDates += getDaysInMonth(year, month + 1); // Current
        numDates += (7 - numDates % 7) % 7; // Next

        var days = getDates(firstDate, numDates), labels = new Array(7);
        for (var i = 0; i < numDates; i ++) {
          var dt = new Date(days[i]);
          days[i] = makeDate(dt, format.day, (selected && selected.getDate() === dt.getDate() && selected.getMonth() === dt.getMonth() && selected.getFullYear() === dt.getFullYear()), dt.getMonth() !== month);
        }
        for (var j = 0; j < 7; j++) {
          labels[j] = dateFilter(days[j].date, format.dayHeader);
        }
        return { objects: days, title: dateFilter(date, format.dayTitle), labels: labels };
      },
      compare: function(date1, date2) {
        return (new Date( date1.getFullYear(), date1.getMonth(), date1.getDate() ) - new Date( date2.getFullYear(), date2.getMonth(), date2.getDate() ) );
      },
      split: 7,
      step: { months: 1 }
    },
    {
      name: 'month',
      getVisibleDates: function(date, selected) {
        var months = new Array(12), year = date.getFullYear();
        for ( var i = 0; i < 12; i++ ) {
          var dt = new Date(year, i, 1);
          months[i] = makeDate(dt, format.month, (selected && selected.getMonth() === i && selected.getFullYear() === year));
        }
        return { objects: months, title: dateFilter(date, format.monthTitle) };
      },
      compare: function(date1, date2) {
        return new Date( date1.getFullYear(), date1.getMonth() ) - new Date( date2.getFullYear(), date2.getMonth() );
      },
      split: 3,
      step: { years: 1 }
    },
    {
      name: 'year',
      getVisibleDates: function(date, selected) {
        var years = new Array(yearRange), year = date.getFullYear(), startYear = parseInt((year - 1) / yearRange, 10) * yearRange + 1;
        for ( var i = 0; i < yearRange; i++ ) {
          var dt = new Date(startYear + i, 0, 1);
          years[i] = makeDate(dt, format.year, (selected && selected.getFullYear() === dt.getFullYear()));
        }
        return { objects: years, title: [years[0].label, years[yearRange - 1].label].join(' - ') };
      },
      compare: function(date1, date2) {
        return date1.getFullYear() - date2.getFullYear();
      },
      split: 5,
      step: { years: yearRange }
    }
  ];

  this.isDisabled = function(date, mode) {
    var currentMode = this.modes[mode || 0];
    return ((this.minDate && currentMode.compare(date, this.minDate) < 0) || (this.maxDate && currentMode.compare(date, this.maxDate) > 0) || ($scope.dateDisabled && $scope.dateDisabled({date: date, mode: currentMode.name})));
  };
}])

.directive( 'datepicker', ['dateFilter', '$parse', 'datepickerConfig', '$log', function (dateFilter, $parse, datepickerConfig, $log) {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'template/datepicker/datepicker.html',
    scope: {
      dateDisabled: '&'
    },
    require: ['datepicker', '?^ngModel'],
    controller: 'DatepickerController',
    link: function(scope, element, attrs, ctrls) {
      var datepickerCtrl = ctrls[0], ngModel = ctrls[1];

      if (!ngModel) {
        return; // do nothing if no ng-model
      }

      // Configuration parameters
      var mode = 0, selected = new Date(), showWeeks = datepickerConfig.showWeeks;

      if (attrs.showWeeks) {
        scope.$parent.$watch($parse(attrs.showWeeks), function(value) {
          showWeeks = !! value;
          updateShowWeekNumbers();
        });
      } else {
        updateShowWeekNumbers();
      }

      if (attrs.min) {
        scope.$parent.$watch($parse(attrs.min), function(value) {
          datepickerCtrl.minDate = value ? new Date(value) : null;
          refill();
        });
      }
      if (attrs.max) {
        scope.$parent.$watch($parse(attrs.max), function(value) {
          datepickerCtrl.maxDate = value ? new Date(value) : null;
          refill();
        });
      }

      function updateShowWeekNumbers() {
        scope.showWeekNumbers = mode === 0 && showWeeks;
      }

      // Split array into smaller arrays
      function split(arr, size) {
        var arrays = [];
        while (arr.length > 0) {
          arrays.push(arr.splice(0, size));
        }
        return arrays;
      }

      function refill( updateSelected ) {
        var date = null, valid = true;

        if ( ngModel.$modelValue ) {
          date = new Date( ngModel.$modelValue );

          if ( isNaN(date) ) {
            valid = false;
            $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
          } else if ( updateSelected ) {
            selected = date;
          }
        }
        ngModel.$setValidity('date', valid);

        var currentMode = datepickerCtrl.modes[mode], data = currentMode.getVisibleDates(selected, date);
        angular.forEach(data.objects, function(obj) {
          obj.disabled = datepickerCtrl.isDisabled(obj.date, mode);
        });

        ngModel.$setValidity('date-disabled', (!date || !datepickerCtrl.isDisabled(date)));

        scope.rows = split(data.objects, currentMode.split);
        scope.labels = data.labels || [];
        scope.title = data.title;
      }

      function setMode(value) {
        mode = value;
        updateShowWeekNumbers();
        refill();
      }

      ngModel.$render = function() {
        refill( true );
      };

      scope.select = function( date ) {
        if ( mode === 0 ) {
          var dt = ngModel.$modelValue ? new Date( ngModel.$modelValue ) : new Date(0, 0, 0, 0, 0, 0, 0);
          dt.setFullYear( date.getFullYear(), date.getMonth(), date.getDate() );
          ngModel.$setViewValue( dt );
          refill( true );
        } else {
          selected = date;
          setMode( mode - 1 );
        }
      };
      scope.move = function(direction) {
        var step = datepickerCtrl.modes[mode].step;
        selected.setMonth( selected.getMonth() + direction * (step.months || 0) );
        selected.setFullYear( selected.getFullYear() + direction * (step.years || 0) );
        refill();
      };
      scope.toggleMode = function() {
        setMode( (mode + 1) % datepickerCtrl.modes.length );
      };
      scope.getWeekNumber = function(row) {
        return ( mode === 0 && scope.showWeekNumbers && row.length === 7 ) ? getISO8601WeekNumber(row[0].date) : null;
      };

      function getISO8601WeekNumber(date) {
        var checkDate = new Date(date);
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
        var time = checkDate.getTime();
        checkDate.setMonth(0); // Compare with Jan 1
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
      }
    }
  };
}])

.constant('datepickerPopupConfig', {
  dateFormat: 'yyyy-MM-dd',
  currentText: 'Today',
  toggleWeeksText: 'Weeks',
  clearText: 'Clear',
  closeText: 'Done',
  closeOnDateSelection: true,
  appendToBody: false,
  showButtonBar: true
})

.directive('datepickerPopup', ['$compile', '$parse', '$document', '$position', 'dateFilter', 'datepickerPopupConfig', 'datepickerConfig',
function ($compile, $parse, $document, $position, dateFilter, datepickerPopupConfig, datepickerConfig) {
  return {
    restrict: 'EA',
    require: 'ngModel',
    link: function(originalScope, element, attrs, ngModel) {
      var scope = originalScope.$new(), // create a child scope so we are not polluting original one
          dateFormat,
          closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? originalScope.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection,
          appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? originalScope.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;

      attrs.$observe('datepickerPopup', function(value) {
          dateFormat = value || datepickerPopupConfig.dateFormat;
          ngModel.$render();
      });

      scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? originalScope.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar;

      originalScope.$on('$destroy', function() {
        $popup.remove();
        scope.$destroy();
      });

      attrs.$observe('currentText', function(text) {
        scope.currentText = angular.isDefined(text) ? text : datepickerPopupConfig.currentText;
      });
      attrs.$observe('toggleWeeksText', function(text) {
        scope.toggleWeeksText = angular.isDefined(text) ? text : datepickerPopupConfig.toggleWeeksText;
      });
      attrs.$observe('clearText', function(text) {
        scope.clearText = angular.isDefined(text) ? text : datepickerPopupConfig.clearText;
      });
      attrs.$observe('closeText', function(text) {
        scope.closeText = angular.isDefined(text) ? text : datepickerPopupConfig.closeText;
      });

      var getIsOpen, setIsOpen;
      if ( attrs.isOpen ) {
        getIsOpen = $parse(attrs.isOpen);
        setIsOpen = getIsOpen.assign;

        originalScope.$watch(getIsOpen, function updateOpen(value) {
          scope.isOpen = !! value;
        });
      }
      scope.isOpen = getIsOpen ? getIsOpen(originalScope) : false; // Initial state

      function setOpen( value ) {
        if (setIsOpen) {
          setIsOpen(originalScope, !!value);
        } else {
          scope.isOpen = !!value;
        }
      }

      var documentClickBind = function(event) {
        if (scope.isOpen && event.target !== element[0]) {
          scope.$apply(function() {
            setOpen(false);
          });
        }
      };

      var elementFocusBind = function() {
        scope.$apply(function() {
          setOpen( true );
        });
      };

      // popup element used to display calendar
      var popupEl = angular.element('<div datepicker-popup-wrap><div datepicker></div></div>');
      popupEl.attr({
        'ng-model': 'date',
        'ng-change': 'dateSelection()'
      });
      var datepickerEl = angular.element(popupEl.children()[0]);
      if (attrs.datepickerOptions) {
        datepickerEl.attr(angular.extend({}, originalScope.$eval(attrs.datepickerOptions)));
      }

      // TODO: reverse from dateFilter string to Date object
      function parseDate(viewValue) {
        if (!viewValue) {
          ngModel.$setValidity('date', true);
          return null;
        } else if (angular.isDate(viewValue)) {
          ngModel.$setValidity('date', true);
          return viewValue;
        } else if (angular.isString(viewValue)) {
          var date = new Date(viewValue);
          if (isNaN(date)) {
            ngModel.$setValidity('date', false);
            return undefined;
          } else {
            ngModel.$setValidity('date', true);
            return date;
          }
        } else {
          ngModel.$setValidity('date', false);
          return undefined;
        }
      }
      ngModel.$parsers.unshift(parseDate);

      // Inner change
      scope.dateSelection = function(dt) {
        if (angular.isDefined(dt)) {
          scope.date = dt;
        }
        ngModel.$setViewValue(scope.date);
        ngModel.$render();

        if (closeOnDateSelection) {
          setOpen( false );
        }
      };

      element.bind('input change keyup', function() {
        scope.$apply(function() {
          scope.date = ngModel.$modelValue;
        });
      });

      // Outter change
      ngModel.$render = function() {
        var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : '';
        element.val(date);
        scope.date = ngModel.$modelValue;
      };

      function addWatchableAttribute(attribute, scopeProperty, datepickerAttribute) {
        if (attribute) {
          originalScope.$watch($parse(attribute), function(value){
            scope[scopeProperty] = value;
          });
          datepickerEl.attr(datepickerAttribute || scopeProperty, scopeProperty);
        }
      }
      addWatchableAttribute(attrs.min, 'min');
      addWatchableAttribute(attrs.max, 'max');
      if (attrs.showWeeks) {
        addWatchableAttribute(attrs.showWeeks, 'showWeeks', 'show-weeks');
      } else {
        scope.showWeeks = datepickerConfig.showWeeks;
        datepickerEl.attr('show-weeks', 'showWeeks');
      }
      if (attrs.dateDisabled) {
        datepickerEl.attr('date-disabled', attrs.dateDisabled);
      }

      function updatePosition() {
        scope.position = appendToBody ? $position.offset(element) : $position.position(element);
        scope.position.top = scope.position.top + element.prop('offsetHeight');
      }

      var documentBindingInitialized = false, elementFocusInitialized = false;
      scope.$watch('isOpen', function(value) {
        if (value) {
          updatePosition();
          $document.bind('click', documentClickBind);
          if(elementFocusInitialized) {
            element.unbind('focus', elementFocusBind);
          }
          element[0].focus();
          documentBindingInitialized = true;
        } else {
          if(documentBindingInitialized) {
            $document.unbind('click', documentClickBind);
          }
          element.bind('focus', elementFocusBind);
          elementFocusInitialized = true;
        }

        if ( setIsOpen ) {
          setIsOpen(originalScope, value);
        }
      });

      scope.today = function() {
        scope.dateSelection(new Date());
      };
      scope.clear = function() {
        scope.dateSelection(null);
      };

      var $popup = $compile(popupEl)(scope);
      if ( appendToBody ) {
        $document.find('body').append($popup);
      } else {
        element.after($popup);
      }
    }
  };
}])

.directive('datepickerPopupWrap', function() {
  return {
    restrict:'EA',
    replace: true,
    transclude: true,
    templateUrl: 'template/datepicker/popup.html',
    link:function (scope, element, attrs) {
      element.bind('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
      });
    }
  };
});

angular.module('ui.bootstrap.dropdown', ['ui.bootstrap.position'])

.constant('dropdownConfig', {
  openClass: 'open'
})

.service('dropdownService', ['$document', '$rootScope', function($document, $rootScope) {
  var openScope = null;

  this.open = function(dropdownScope) {
    if (!openScope) {
      $document.bind('click', closeDropdown);
      $document.bind('keydown', keybindFilter);
    }

    if (openScope && openScope !== dropdownScope) {
      openScope.isOpen = false;
    }

    openScope = dropdownScope;
  };

  this.close = function(dropdownScope) {
    if (openScope === dropdownScope) {
      openScope = null;
      $document.unbind('click', closeDropdown);
      $document.unbind('keydown', keybindFilter);
    }
  };

  var closeDropdown = function(evt) {
    // This method may still be called during the same mouse event that
    // unbound this event handler. So check openScope before proceeding.
    if (!openScope) { return; }

    if (evt && openScope.getAutoClose() === 'disabled')  { return ; }

    var toggleElement = openScope.getToggleElement();
    if (evt && toggleElement && toggleElement[0].contains(evt.target)) {
      return;
    }

    var dropdownElement = openScope.getDropdownElement();
    if (evt && openScope.getAutoClose() === 'outsideClick' &&
      dropdownElement && dropdownElement[0].contains(evt.target)) {
      return;
    }

    openScope.isOpen = false;

    if (!$rootScope.$$phase) {
      openScope.$apply();
    }
  };

  var keybindFilter = function(evt) {
    if (evt.which === 27) {
      openScope.focusToggleElement();
      closeDropdown();
    } else if (openScope.isKeynavEnabled() && /(38|40)/.test(evt.which) && openScope.isOpen) {
      evt.preventDefault();
      evt.stopPropagation();
      openScope.focusDropdownEntry(evt.which);
    }
  };
}])

.controller('DropdownController', ['$scope', '$attrs', '$parse', 'dropdownConfig', 'dropdownService', '$animate', '$position', '$document', '$compile', '$templateRequest', function($scope, $attrs, $parse, dropdownConfig, dropdownService, $animate, $position, $document, $compile, $templateRequest) {
  var self = this,
    scope = $scope.$new(), // create a child scope so we are not polluting original one
    templateScope,
    openClass = dropdownConfig.openClass,
    getIsOpen,
    setIsOpen = angular.noop,
    toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop,
    appendToBody = false,
    keynavEnabled = false,
    selectedOption = null,
    body = $document.find('body');

  this.init = function(element) {
    self.$element = element;

    if ($attrs.isOpen) {
      getIsOpen = $parse($attrs.isOpen);
      setIsOpen = getIsOpen.assign;

      $scope.$watch(getIsOpen, function(value) {
        scope.isOpen = !!value;
      });
    }

    appendToBody = angular.isDefined($attrs.dropdownAppendToBody);
    keynavEnabled = angular.isDefined($attrs.keyboardNav);

    if (appendToBody && self.dropdownMenu) {
      body.append(self.dropdownMenu);
      body.addClass('dropdown');
      element.on('$destroy', function handleDestroyEvent() {
        self.dropdownMenu.remove();
      });
    }
  };

  this.toggle = function(open) {
    return scope.isOpen = arguments.length ? !!open : !scope.isOpen;
  };

  // Allow other directives to watch status
  this.isOpen = function() {
    return scope.isOpen;
  };

  scope.getToggleElement = function() {
    return self.toggleElement;
  };

  scope.getAutoClose = function() {
    return $attrs.autoClose || 'always'; //or 'outsideClick' or 'disabled'
  };

  scope.getElement = function() {
    return self.$element;
  };

  scope.isKeynavEnabled = function() {
    return keynavEnabled;
  };

  scope.focusDropdownEntry = function(keyCode) {
    var elems = self.dropdownMenu ? //If append to body is used.
      (angular.element(self.dropdownMenu).find('a')) :
      (angular.element(self.$element).find('ul').eq(0).find('a'));

    switch (keyCode) {
      case (40): {
        if (!angular.isNumber(self.selectedOption)) {
          self.selectedOption = 0;
        } else {
          self.selectedOption = (self.selectedOption === elems.length -1 ?
            self.selectedOption :
            self.selectedOption + 1);
        }
        break;
      }
      case (38): {
        if (!angular.isNumber(self.selectedOption)) {
          self.selectedOption = elems.length - 1;
        } else {
          self.selectedOption = self.selectedOption === 0 ?
            0 : self.selectedOption - 1;
        }
        break;
      }
    }
    elems[self.selectedOption].focus();
  };

  scope.getDropdownElement = function() {
    return self.dropdownMenu;
  };

  scope.focusToggleElement = function() {
    if (self.toggleElement) {
      self.toggleElement[0].focus();
    }
  };

  scope.$watch('isOpen', function(isOpen, wasOpen) {
    if (appendToBody && self.dropdownMenu) {
      var pos = $position.positionElements(self.$element, self.dropdownMenu, 'bottom-left', true);
      var css = {
        top: pos.top + 'px',
        display: isOpen ? 'block' : 'none'
      };

      var rightalign = self.dropdownMenu.hasClass('dropdown-menu-right');
      if (!rightalign) {
        css.left = pos.left + 'px';
        css.right = 'auto';
      } else {
        css.left = 'auto';
        css.right = (window.innerWidth - (pos.left + self.$element.prop('offsetWidth'))) + 'px';
      }

      self.dropdownMenu.css(css);
    }

    var openContainer = appendToBody ? body : self.$element;

    $animate[isOpen ? 'addClass' : 'removeClass'](openContainer, openClass).then(function() {
      if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
        toggleInvoker($scope, { open: !!isOpen });
      }
    });

    if (isOpen) {
      if (self.dropdownMenuTemplateUrl) {
        $templateRequest(self.dropdownMenuTemplateUrl).then(function(tplContent) {
          templateScope = scope.$new();
          $compile(tplContent.trim())(templateScope, function(dropdownElement) {
            var newEl = dropdownElement;
            self.dropdownMenu.replaceWith(newEl);
            self.dropdownMenu = newEl;
          });
        });
      }

      scope.focusToggleElement();
      dropdownService.open(scope);
    } else {
      if (self.dropdownMenuTemplateUrl) {
        if (templateScope) {
          templateScope.$destroy();
        }
        var newEl = angular.element('<ul class="dropdown-menu"></ul>');
        self.dropdownMenu.replaceWith(newEl);
        self.dropdownMenu = newEl;
      }

      dropdownService.close(scope);
      self.selectedOption = null;
    }

    if (angular.isFunction(setIsOpen)) {
      setIsOpen($scope, isOpen);
    }
  });

  $scope.$on('$locationChangeSuccess', function() {
    if (scope.getAutoClose() !== 'disabled') {
      scope.isOpen = false;
    }
  });

  var offDestroy = $scope.$on('$destroy', function() {
    scope.$destroy();
  });
  scope.$on('$destroy', offDestroy);
}])

.directive('dropdown', function() {
  return {
    controller: 'DropdownController',
    link: function(scope, element, attrs, dropdownCtrl) {
      dropdownCtrl.init(element);
      element.addClass('dropdown');
    }
  };
})

.directive('dropdownMenu', function() {
  return {
    restrict: 'AC',
    require: '?^dropdown',
    link: function(scope, element, attrs, dropdownCtrl) {
      if (!dropdownCtrl) {
        return;
      }
      var tplUrl = attrs.templateUrl;
      if (tplUrl) {
        dropdownCtrl.dropdownMenuTemplateUrl = tplUrl;
      }
      if (!dropdownCtrl.dropdownMenu) {
        dropdownCtrl.dropdownMenu = element;
      }
    }
  };
})

.directive('keyboardNav', function() {
  return {
    restrict: 'A',
    require: '?^dropdown',
    link: function(scope, element, attrs, dropdownCtrl) {
      element.bind('keydown', function(e) {
        if ([38, 40].indexOf(e.which) !== -1) {
          e.preventDefault();
          e.stopPropagation();

          var elems = dropdownCtrl.dropdownMenu.find('a');

          switch (e.which) {
            case (40): { // Down
              if (!angular.isNumber(dropdownCtrl.selectedOption)) {
                dropdownCtrl.selectedOption = 0;
              } else {
                dropdownCtrl.selectedOption = dropdownCtrl.selectedOption === elems.length -1 ?
                  dropdownCtrl.selectedOption : dropdownCtrl.selectedOption + 1;
              }
              break;
            }
            case (38): { // Up
              if (!angular.isNumber(dropdownCtrl.selectedOption)) {
                dropdownCtrl.selectedOption = elems.length - 1;
              } else {
                dropdownCtrl.selectedOption = dropdownCtrl.selectedOption === 0 ?
                  0 : dropdownCtrl.selectedOption - 1;
              }
              break;
            }
          }
          elems[dropdownCtrl.selectedOption].focus();
        }
      });
    }
  };
})

.directive('dropdownToggle', function() {
  return {
    require: '?^dropdown',
    link: function(scope, element, attrs, dropdownCtrl) {
      if (!dropdownCtrl) {
        return;
      }

      element.addClass('dropdown-toggle');

      dropdownCtrl.toggleElement = element;

      var toggleDropdown = function(event) {
        event.preventDefault();

        if (!element.hasClass('disabled') && !attrs.disabled) {
          scope.$apply(function() {
            dropdownCtrl.toggle();
          });
        }
      };

      element.bind('click', toggleDropdown);

      // WAI-ARIA
      element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
      scope.$watch(dropdownCtrl.isOpen, function(isOpen) {
        element.attr('aria-expanded', !!isOpen);
      });

      scope.$on('$destroy', function() {
        element.unbind('click', toggleDropdown);
      });
    }
  };
});

angular.module('ui.bootstrap.stackedMap', [])
/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
  .factory('$$stackedMap', function() {
    return {
      createNew: function() {
        var stack = [];

        return {
          add: function(key, value) {
            stack.push({
              key: key,
              value: value
            });
          },
          get: function(key) {
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                return stack[i];
              }
            }
          },
          keys: function() {
            var keys = [];
            for (var i = 0; i < stack.length; i++) {
              keys.push(stack[i].key);
            }
            return keys;
          },
          top: function() {
            return stack[stack.length - 1];
          },
          remove: function(key) {
            var idx = -1;
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                idx = i;
                break;
              }
            }
            return stack.splice(idx, 1)[0];
          },
          removeTop: function() {
            return stack.splice(stack.length - 1, 1)[0];
          },
          length: function() {
            return stack.length;
          }
        };
      }
    };
  });
angular.module('ui.bootstrap.modal', ['ui.bootstrap.stackedMap'])
/**
 * A helper, internal data structure that stores all references attached to key
 */
  .factory('$$multiMap', function() {
    return {
      createNew: function() {
        var map = {};

        return {
          entries: function() {
            return Object.keys(map).map(function(key) {
              return {
                key: key,
                value: map[key]
              };
            });
          },
          get: function(key) {
            return map[key];
          },
          hasKey: function(key) {
            return !!map[key];
          },
          keys: function() {
            return Object.keys(map);
          },
          put: function(key, value) {
            if (!map[key]) {
              map[key] = [];
            }

            map[key].push(value);
          },
          remove: function(key, value) {
            var values = map[key];

            if (!values) {
              return;
            }

            var idx = values.indexOf(value);

            if (idx !== -1) {
              values.splice(idx, 1);
            }

            if (!values.length) {
              delete map[key];
            }
          }
        };
      }
    };
  })

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
  .directive('modalBackdrop', [
           '$animate', '$injector', '$modalStack',
  function($animate ,  $injector,   $modalStack) {
    var $animateCss = null;

    if ($injector.has('$animateCss')) {
      $animateCss = $injector.get('$animateCss');
    }

    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'template/modal/backdrop.html',
      compile: function(tElement, tAttrs) {
        tElement.addClass(tAttrs.backdropClass);
        return linkFn;
      }
    };

    function linkFn(scope, element, attrs) {
      if (attrs.modalInClass) {
        if ($animateCss) {
          $animateCss(element, {
            addClass: attrs.modalInClass
          }).start();
        } else {
          $animate.addClass(element, attrs.modalInClass);
        }

        scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
          var done = setIsAsync();
          if ($animateCss) {
            $animateCss(element, {
              removeClass: attrs.modalInClass
            }).start().then(done);
          } else {
            $animate.removeClass(element, attrs.modalInClass).then(done);
          }
        });
      }
    }
  }])

  .directive('modalWindow', [
           '$modalStack', '$q', '$animate', '$injector', '$rootScope',
  function($modalStack ,  $q ,  $animate,   $injector, $rootScope) {
    var $animateCss = null;

    if ($injector.has('$animateCss')) {
      $animateCss = $injector.get('$animateCss');
    }

    return {
      restrict: 'EA',
      scope: {
        index: '@'
      },
      replace: true,
      transclude: true,
      templateUrl: function(tElement, tAttrs) {
        return tAttrs.templateUrl || 'template/modal/window.html';
      },
      link: function(scope, element, attrs) {
        element.addClass(attrs.windowClass || '');
        element.addClass(attrs.windowTopClass || '');
        scope.size = attrs.size;

        scope.close = function(evt) {
          var modal = $modalStack.getTop();
          if (modal && modal.value.backdrop && modal.value.backdrop !== 'static' && (evt.target === evt.currentTarget)) {
            evt.preventDefault();
            evt.stopPropagation();

            // quick hack to open mspx modal if closed
            if ($rootScope.mspxCloseConfirmationModal) {
              $rootScope.mspxCloseConfirmationModal().then(function() {
                $modalStack.dismiss(modal.key, 'backdrop click');
              });
            } else {
              $modalStack.dismiss(modal.key, 'backdrop click');
            }
          }
        };

        // moved from template to fix issue #2280
        element.on('click', scope.close);

        // This property is only added to the scope for the purpose of detecting when this directive is rendered.
        // We can detect that by using this property in the template associated with this directive and then use
        // {@link Attribute#$observe} on it. For more details please see {@link TableColumnResize}.
        scope.$isRendered = true;

        // Deferred object that will be resolved when this modal is render.
        var modalRenderDeferObj = $q.defer();
        // Observe function will be called on next digest cycle after compilation, ensuring that the DOM is ready.
        // In order to use this way of finding whether DOM is ready, we need to observe a scope property used in modal's template.
        attrs.$observe('modalRender', function(value) {
          if (value == 'true') {
            modalRenderDeferObj.resolve();
          }
        });

        modalRenderDeferObj.promise.then(function() {
          var animationPromise = null;

          if (attrs.modalInClass) {
            if ($animateCss) {
              animationPromise = $animateCss(element, {
                addClass: attrs.modalInClass
              }).start();
            } else {
              animationPromise = $animate.addClass(element, attrs.modalInClass);
            }

            scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
              var done = setIsAsync();
              if ($animateCss) {
                $animateCss(element, {
                  removeClass: attrs.modalInClass
                }).start().then(done);
              } else {
                $animate.removeClass(element, attrs.modalInClass).then(done);
              }
            });
          }


          $q.when(animationPromise).then(function() {
            var inputsWithAutofocus = element[0].querySelectorAll('[autofocus]');
            /**
             * Auto-focusing of a freshly-opened modal element causes any child elements
             * with the autofocus attribute to lose focus. This is an issue on touch
             * based devices which will show and then hide the onscreen keyboard.
             * Attempts to refocus the autofocus element via JavaScript will not reopen
             * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
             * the modal element if the modal does not contain an autofocus element.
             */
            if (inputsWithAutofocus.length) {
              inputsWithAutofocus[0].focus();
            } else {
              element[0].focus();
            }
          });

          // Notify {@link $modalStack} that modal is rendered.
          var modal = $modalStack.getTop();
          if (modal) {
            $modalStack.modalRendered(modal.key);
          }
        });
      }
    };
  }])

  .directive('modalAnimationClass', [
    function () {
      return {
        compile: function(tElement, tAttrs) {
          if (tAttrs.modalAnimation) {
            tElement.addClass(tAttrs.modalAnimationClass);
          }
        }
      };
    }])

  .directive('modalTransclude', function() {
    return {
      link: function($scope, $element, $attrs, controller, $transclude) {
        $transclude($scope.$parent, function(clone) {
          $element.empty();
          $element.append(clone);
        });
      }
    };
  })

  .factory('$modalStack', [
             '$animate', '$timeout', '$document', '$compile', '$rootScope',
             '$q',
             '$injector',
             '$$multiMap',
             '$$stackedMap',
    function($animate ,  $timeout ,  $document ,  $compile ,  $rootScope ,
              $q,
              $injector,
              $$multiMap,
              $$stackedMap) {
      var $animateCss = null;

      if ($injector.has('$animateCss')) {
        $animateCss = $injector.get('$animateCss');
      }

      var OPENED_MODAL_CLASS = 'modal-open';

      var backdropDomEl, backdropScope;
      var openedWindows = $$stackedMap.createNew();
      var openedClasses = $$multiMap.createNew();
      var $modalStack = {
        NOW_CLOSING_EVENT: 'modal.stack.now-closing'
      };

      //Modal focus behavior
      var focusableElementList;
      var focusIndex = 0;
      var tababbleSelector = 'a[href], area[href], input:not([disabled]), ' +
        'button:not([disabled]),select:not([disabled]), textarea:not([disabled]), ' +
        'iframe, object, embed, *[tabindex], *[contenteditable=true]';

      function backdropIndex() {
        var topBackdropIndex = -1;
        var opened = openedWindows.keys();
        for (var i = 0; i < opened.length; i++) {
          if (openedWindows.get(opened[i]).value.backdrop) {
            topBackdropIndex = i;
          }
        }
        return topBackdropIndex;
      }

      $rootScope.$watch(backdropIndex, function(newBackdropIndex) {
        if (backdropScope) {
          backdropScope.index = newBackdropIndex;
        }
      });

      function removeModalWindow(modalInstance, elementToReceiveFocus, noGC) {
        var body = $document.find('body').eq(0);
        var modalWindow = openedWindows.get(modalInstance).value;

        //clean up the stack
        openedWindows.remove(modalInstance);

        removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, function() {
          var modalBodyClass = modalWindow.openedClass || OPENED_MODAL_CLASS;
          openedClasses.remove(modalBodyClass, modalInstance);
          body.toggleClass(modalBodyClass, openedClasses.hasKey(modalBodyClass));
          toggleTopWindowClass(true);
        });
        checkRemoveBackdrop(noGC);
        //fix for lonely modal-open class being left on the body after modal has been closed, bug yet to be fixed in lib
        $('body').removeClass('modal-open');

        //move focus to specified element if available, or else to body
        if (elementToReceiveFocus && elementToReceiveFocus.focus) {
          elementToReceiveFocus.focus();
        } else {
          body.focus();
        }
      }

      // Add or remove "windowTopClass" from the top window in the stack
      function toggleTopWindowClass(toggleSwitch) {
        var modalWindow;

        if (openedWindows.length() > 0) {
          modalWindow = openedWindows.top().value;
          modalWindow.modalDomEl.toggleClass(modalWindow.windowTopClass || '', toggleSwitch);
        }
      }

      function checkRemoveBackdrop(noGC) {
          //remove backdrop if no longer needed
          if (backdropDomEl && backdropIndex() == -1) {
            var backdropScopeRef = backdropScope;
            removeAfterAnimate(backdropDomEl, backdropScope, noGC, function() {
              backdropScopeRef = null;
            });
            backdropDomEl = undefined;
            backdropScope = undefined;
          }
      }

      function removeAfterAnimate(domEl, scope, noGC, done) {
        var asyncDeferred;
        var asyncPromise = null;
        var setIsAsync = function() {
          if (!asyncDeferred) {
            asyncDeferred = $q.defer();
            asyncPromise = asyncDeferred.promise;
          }

          return function asyncDone() {
            asyncDeferred.resolve();
          };
        };
        scope.$broadcast($modalStack.NOW_CLOSING_EVENT, setIsAsync);

        // Note that it's intentional that asyncPromise might be null.
        // That's when setIsAsync has not been called during the
        // NOW_CLOSING_EVENT broadcast.
        return $q.when(asyncPromise).then(afterAnimating);

        function afterAnimating() {
          if (afterAnimating.done) {
            return;
          }
          afterAnimating.done = true;

          if ($animateCss) {
            $animateCss(domEl, {
              event: 'leave'
            }).start().then(function() {
              domEl.remove();
            });
          } else {
            $animate.leave(domEl);
          }
          //Mspx gc hax
          if (noGC) {
            !scope.$destroyGrandParent && (scope.__proto__.$destroyGrandParent = function() {
              scope.$destroy();
            });
          } else {
            scope.$destroyGrandParent && scope.$destroyGrandParent();
            scope.$destroy();
          }

          if (done) {
            done();
          }
        }
      }

      $document.bind('keydown', function(evt) {
        if (evt.isDefaultPrevented()) {
          return evt;
        }

        var modal = openedWindows.top();
        if (modal && modal.value.keyboard) {
          switch (evt.which){
            case 27: {
              evt.preventDefault();
              $rootScope.$apply(function() {
                $modalStack.dismiss(modal.key, 'escape key press');
              });
              break;
            }
            case 9: {
              $modalStack.loadFocusElementList(modal);
              var focusChanged = false;
              if (evt.shiftKey) {
                if ($modalStack.isFocusInFirstItem(evt)) {
                  focusChanged = $modalStack.focusLastFocusableElement();
                }
              } else {
                if ($modalStack.isFocusInLastItem(evt)) {
                  focusChanged = $modalStack.focusFirstFocusableElement();
                }
              }

              if (focusChanged) {
                evt.preventDefault();
                evt.stopPropagation();
              }
              break;
            }
          }
        }
      });

      $modalStack.open = function(modalInstance, modal) {
        var modalOpener = $document[0].activeElement,
          modalBodyClass = modal.openedClass || OPENED_MODAL_CLASS;

        toggleTopWindowClass(false);

        openedWindows.add(modalInstance, {
          deferred: modal.deferred,
          renderDeferred: modal.renderDeferred,
          modalScope: modal.scope,
          backdrop: modal.backdrop,
          keyboard: modal.keyboard,
          openedClass: modal.openedClass,
          windowTopClass: modal.windowTopClass
        });

        openedClasses.put(modalBodyClass, modalInstance);

        var body = $document.find('body').eq(0),
            currBackdropIndex = backdropIndex();

        if (currBackdropIndex >= 0 && !backdropDomEl) {
          backdropScope = $rootScope.$new(true);
          backdropScope.index = currBackdropIndex;
          var angularBackgroundDomEl = angular.element('<div modal-backdrop="modal-backdrop"></div>');
          angularBackgroundDomEl.attr('backdrop-class', modal.backdropClass);
          if (modal.animation) {
            angularBackgroundDomEl.attr('modal-animation', 'true');
          }
          backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
          body.append(backdropDomEl);
        }

        var angularDomEl = angular.element('<div modal-window="modal-window"></div>');
        angularDomEl.attr({
          'template-url': modal.windowTemplateUrl,
          'window-class': modal.windowClass,
          'window-top-class': modal.windowTopClass,
          'size': modal.size,
          'index': openedWindows.length() - 1,
          'animate': 'animate'
        }).html(modal.content);
        if (modal.animation) {
          angularDomEl.attr('modal-animation', 'true');
        }

        var modalDomEl = $compile(angularDomEl)(modal.scope);
        openedWindows.top().value.modalDomEl = modalDomEl;
        openedWindows.top().value.modalOpener = modalOpener;
        body.append(modalDomEl);
        body.addClass(modalBodyClass);

        $modalStack.clearFocusListCache();
      };

      function broadcastClosing(modalWindow, resultOrReason, closing) {
          return !modalWindow.value.modalScope.$broadcast('modal.closing', resultOrReason, closing).defaultPrevented;
      }

      $modalStack.close = function(modalInstance, result) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow && broadcastClosing(modalWindow, result, true)) {
          modalWindow.value.modalScope.$$uibDestructionScheduled = true;
          modalWindow.value.deferred.resolve(result);
          removeModalWindow(modalInstance, modalWindow.value.modalOpener);
          return true;
        }
        return !modalWindow;
      };

      $modalStack.dismiss = function(modalInstance, reason) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow && broadcastClosing(modalWindow, reason, false)) {
          modalWindow.value.modalScope.$$uibDestructionScheduled = true;
          modalWindow.value.deferred.reject(reason);
          removeModalWindow(modalInstance, modalWindow.value.modalOpener);
          return true;
        }
        return !modalWindow;
      };

      $modalStack.closeNoGC = function(modalInstance, result) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow && broadcastClosing(modalWindow, result, true)) {
          modalWindow.value.modalScope.$$uibDestructionScheduled = true;
          modalWindow.value.deferred.resolve(result);
          removeModalWindow(modalInstance, modalWindow.value.modalOpener, true);
          return true;
        }
        return !modalWindow;
      };

      $modalStack.dismissNoGC = function(modalInstance, reason) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow && broadcastClosing(modalWindow, reason, false)) {
          modalWindow.value.modalScope.$$uibDestructionScheduled = true;
          modalWindow.value.deferred.reject(reason);
          removeModalWindow(modalInstance, modalWindow.value.modalOpener, true);
          return true;
        }
        return !modalWindow;
      };

      $modalStack.dismissAll = function(reason) {
        var topModal = this.getTop();
        while (topModal && this.dismiss(topModal.key, reason)) {
          topModal = this.getTop();
        }
      };

      $modalStack.getTop = function() {
        return openedWindows.top();
      };

      $modalStack.modalRendered = function(modalInstance) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow) {
          modalWindow.value.renderDeferred.resolve();
        }
      };

      $modalStack.focusFirstFocusableElement = function() {
        if (focusableElementList.length > 0) {
          focusableElementList[0].focus();
          return true;
        }
        return false;
      };
      $modalStack.focusLastFocusableElement = function() {
        if (focusableElementList.length > 0) {
          focusableElementList[focusableElementList.length - 1].focus();
          return true;
        }
        return false;
      };

      $modalStack.isFocusInFirstItem = function(evt) {
        if (focusableElementList.length > 0) {
          return (evt.target || evt.srcElement) == focusableElementList[0];
        }
        return false;
      };

      $modalStack.isFocusInLastItem = function(evt) {
        if (focusableElementList.length > 0) {
          return (evt.target || evt.srcElement) == focusableElementList[focusableElementList.length - 1];
        }
        return false;
      };

      $modalStack.clearFocusListCache = function() {
        focusableElementList = [];
        focusIndex = 0;
      };

      $modalStack.loadFocusElementList = function(modalWindow) {
        if (focusableElementList === undefined || !focusableElementList.length0) {
          if (modalWindow) {
            var modalDomE1 = modalWindow.value.modalDomEl;
            if (modalDomE1 && modalDomE1.length) {
              focusableElementList = modalDomE1[0].querySelectorAll(tababbleSelector);
            }
          }
        }
      };

      return $modalStack;
    }])

  .provider('$modal', function() {
    var $modalProvider = {
      options: {
        animation: true,
        backdrop: true, //can also be false or 'static'
        keyboard: true
      },
      $get: ['$injector', '$rootScope', '$q', '$templateRequest', '$controller', '$modalStack',
        function ($injector, $rootScope, $q, $templateRequest, $controller, $modalStack) {
          var $modal = {};

          function getTemplatePromise(options) {
            return options.template ? $q.when(options.template) :
              $templateRequest(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl);
          }

          function getResolvePromises(resolves) {
            var promisesArr = [];
            angular.forEach(resolves, function(value) {
              if (angular.isFunction(value) || angular.isArray(value)) {
                promisesArr.push($q.when($injector.invoke(value)));
              } else if (angular.isString(value)) {
                promisesArr.push($q.when($injector.get(value)));
              } else {
                promisesArr.push($q.when(value));
              }
            });
            return promisesArr;
          }

          var promiseChain = null;
          $modal.getPromiseChain = function() {
            return promiseChain;
          };

          $modal.open = function (modalOptions) {

            var modalResultDeferred = $q.defer();
            var modalOpenedDeferred = $q.defer();
            var modalRenderDeferred = $q.defer();

            //prepare an instance of a modal to be injected into controllers and returned to a caller
            var modalInstance = {
              result: modalResultDeferred.promise,
              opened: modalOpenedDeferred.promise,
              rendered: modalRenderDeferred.promise,
              close: function (result) {
                return $modalStack.close(modalInstance, result);
              },
              dismiss: function (reason) {
                return $modalStack.dismiss(modalInstance, reason);
              },
              closeNoGC: function (result) {
                return $modalStack.closeNoGC(modalInstance, result);
              },
              dismissNoGC: function (reason) {
                return $modalStack.dismissNoGC(modalInstance, reason);
              }
            };

            //merge and clean up options
            modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
            modalOptions.resolve = modalOptions.resolve || {};

            //verify options
            if (!modalOptions.template && !modalOptions.templateUrl) {
              throw new Error('One of template or templateUrl options is required.');
            }

            var templateAndResolvePromise =
              $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));

            // Wait for the resolution of the existing promise chain.
            // Then switch to our own combined promise dependency (regardless of how the previous modal fared).
            // Then add to $modalStack and resolve opened.
            // Finally clean up the chain variable if no subsequent modal has overwritten it.
            var samePromise;
            samePromise = promiseChain = $q.all([promiseChain])
              .then(function() { return templateAndResolvePromise; }, function() { return templateAndResolvePromise; })
              .then(function resolveSuccess(tplAndVars) {

                var modalScope = (modalOptions.scope || $rootScope).$new();
                modalScope.$close = modalInstance.close;
                modalScope.$closeNoGC = modalInstance.closeNoGC;
                modalScope.$dismiss = modalInstance.dismiss;
                modalScope.$dismissNoGC = modalInstance.dismissNoGC;

                modalScope.$on('$destroy', function() {
                  if (!modalScope.$$uibDestructionScheduled) {
                    modalScope.$dismiss('$uibUnscheduledDestruction');
                  }
                });

                var ctrlInstance, ctrlLocals = {};
                var resolveIter = 1;

                //controllers
                if (modalOptions.controller) {
                  ctrlLocals.$scope = modalScope;
                  ctrlLocals.$modalInstance = modalInstance;
                  angular.forEach(modalOptions.resolve, function(value, key) {
                    ctrlLocals[key] = tplAndVars[resolveIter++];
                  });

                  ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                  if (modalOptions.controllerAs) {
                    if (modalOptions.bindToController) {
                      angular.extend(ctrlInstance, modalScope);
                    }

                    modalScope[modalOptions.controllerAs] = ctrlInstance;
                  }
                }

                $modalStack.open(modalInstance, {
                  scope: modalScope,
                  deferred: modalResultDeferred,
                  renderDeferred: modalRenderDeferred,
                  content: tplAndVars[0],
                  animation: modalOptions.animation,
                  backdrop: modalOptions.backdrop,
                  keyboard: modalOptions.keyboard,
                  backdropClass: modalOptions.backdropClass,
                  windowTopClass: modalOptions.windowTopClass,
                  windowClass: modalOptions.windowClass,
                  windowTemplateUrl: modalOptions.windowTemplateUrl,
                  size: modalOptions.size,
                  openedClass: modalOptions.openedClass
                });
                modalOpenedDeferred.resolve(true);

            }, function resolveError(reason) {
              modalOpenedDeferred.reject(reason);
              modalResultDeferred.reject(reason);
            })
            .finally(function() {
              if (promiseChain === samePromise) {
                promiseChain = null;
              }
            });

            return modalInstance;
          };

          return $modal;
        }]
    };

    return $modalProvider;
  });

angular.module('ui.bootstrap.pagination', [])
.controller('PaginationController', ['$scope', '$attrs', '$parse', function($scope, $attrs, $parse) {
  var self = this,
      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
      setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

  this.init = function(ngModelCtrl_, config) {
    ngModelCtrl = ngModelCtrl_;
    this.config = config;

    ngModelCtrl.$render = function() {
      self.render();
    };

    if ($attrs.itemsPerPage) {
      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
        self.itemsPerPage = parseInt(value, 10);
        $scope.totalPages = self.calculateTotalPages();
      });
    } else {
      this.itemsPerPage = config.itemsPerPage;
    }

    $scope.$watch('totalItems', function() {
      $scope.totalPages = self.calculateTotalPages();
    });

    $scope.$watch('totalPages', function(value) {
      setNumPages($scope.$parent, value); // Readonly variable

      if ( $scope.page > value ) {
        $scope.selectPage(value);
      } else {
        ngModelCtrl.$render();
      }
    });
  };

  this.calculateTotalPages = function() {
    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  };

  this.render = function() {
    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
  };

  $scope.selectPage = function(page, evt) {
    if (evt) {
      evt.preventDefault();
    }

    var clickAllowed = !$scope.ngDisabled || !evt;
    if (clickAllowed && $scope.page !== page && page > 0 && page <= $scope.totalPages) {
      if (evt && evt.target) {
        evt.target.blur();
      }
      ngModelCtrl.$setViewValue(page);
      ngModelCtrl.$render();
    }
  };

  $scope.getText = function(key) {
    return $scope[key + 'Text'] || self.config[key + 'Text'];
  };

  $scope.noPrevious = function() {
    return $scope.page === 1;
  };

  $scope.noNext = function() {
    return $scope.page === $scope.totalPages;
  };
}])

.constant('paginationConfig', {
  itemsPerPage: 10,
  boundaryLinks: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: true
})

.directive('pagination', ['$parse', 'paginationConfig', function($parse, paginationConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      firstText: '@',
      previousText: '@',
      nextText: '@',
      lastText: '@',
      ngDisabled:'='
    },
    require: ['pagination', '?ngModel'],
    controller: 'PaginationController',
    controllerAs: 'pagination',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/pagination/pagination.html';
    },
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      // Setup configuration parameters
      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

      paginationCtrl.init(ngModelCtrl, paginationConfig);

      if (attrs.maxSize) {
        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
          maxSize = parseInt(value, 10);
          paginationCtrl.render();
        });
      }

      // Create page object used in template
      function makePage(number, text, isActive) {
        return {
          number: number,
          text: text,
          active: isActive
        };
      }

      function getPages(currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage = 1, endPage = totalPages;
        var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

        // recompute if maxSize
        if (isMaxSized) {
          if (rotate) {
            // Current page is displayed in the middle of the visible ones
            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
            endPage   = startPage + maxSize - 1;

            // Adjust if limit is exceeded
            if (endPage > totalPages) {
              endPage   = totalPages;
              startPage = endPage - maxSize + 1;
            }
          } else {
            // Visible pages are paginated with maxSize
            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

            // Adjust last page if limit is exceeded
            endPage = Math.min(startPage + maxSize - 1, totalPages);
          }
        }

        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
          var page = makePage(number, number, number === currentPage);
          pages.push(page);
        }

        // Add links to move between page sets
        if (isMaxSized && ! rotate) {
          if (startPage > 1) {
            var previousPageSet = makePage(startPage - 1, '...', false);
            pages.unshift(previousPageSet);
          }

          if (endPage < totalPages) {
            var nextPageSet = makePage(endPage + 1, '...', false);
            pages.push(nextPageSet);
          }
        }

        return pages;
      }

      var originalRender = paginationCtrl.render;
      paginationCtrl.render = function() {
        originalRender();
        if (scope.page > 0 && scope.page <= scope.totalPages) {
          scope.pages = getPages(scope.page, scope.totalPages);
        }
      };
    }
  };
}])

.constant('pagerConfig', {
  itemsPerPage: 10,
  previousText: '« Previous',
  nextText: 'Next »',
  align: true
})

.directive('pager', ['pagerConfig', function(pagerConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      previousText: '@',
      nextText: '@',
      ngDisabled: '='
    },
    require: ['pager', '?ngModel'],
    controller: 'PaginationController',
    controllerAs: 'pagination',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/pagination/pager.html';
    },
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
      paginationCtrl.init(ngModelCtrl, pagerConfig);
    }
  };
}]);

/**
 * The following features are still outstanding: animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html tooltips, and selector delegation.
 */
angular.module('ui.bootstrap.tooltip', ['ui.bootstrap.position', 'ui.bootstrap.stackedMap'])

/**
 * The $tooltip service creates tooltip- and popover-like directives as well as
 * houses global options for them.
 */
.provider('$tooltip', function() {
  // The default options tooltip and popover.
  var defaultOptions = {
    placement: 'top',
    animation: true,
    popupDelay: 0,
    useContentExp: false
  };

  // Default hide triggers for each show trigger
  var triggerMap = {
    'mouseenter': 'mouseleave',
    'click': 'click',
    'focus': 'blur',
    'none': ''
  };

  // The options specified to the provider globally.
  var globalOptions = {};

  /**
   * `options({})` allows global configuration of all tooltips in the
   * application.
   *
   *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
   *     // place tooltips left instead of top by default
   *     $tooltipProvider.options( { placement: 'left' } );
   *   });
   */
	this.options = function(value) {
		angular.extend(globalOptions, value);
	};

  /**
   * This allows you to extend the set of trigger mappings available. E.g.:
   *
   *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
   */
  this.setTriggers = function setTriggers(triggers) {
    angular.extend(triggerMap, triggers);
  };

  /**
   * This is a helper function for translating camel-case to snake-case.
   */
  function snake_case(name) {
    var regexp = /[A-Z]/g;
    var separator = '-';
    return name.replace(regexp, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  }

  /**
   * Returns the actual instance of the $tooltip service.
   * TODO support multiple triggers
   */
  this.$get = ['$window', '$compile', '$timeout', '$document', '$position', '$interpolate', '$rootScope', '$parse', '$$stackedMap', function($window, $compile, $timeout, $document, $position, $interpolate, $rootScope, $parse, $$stackedMap) {
    var openedTooltips = $$stackedMap.createNew();
    $document.on('keypress', function(e) {
      if (e.which === 27) {
        var last = openedTooltips.top();
        if (last) {
          last.value.close();
          openedTooltips.removeTop();
          last = null;
        }
      }
    });

    return function $tooltip(type, prefix, defaultTriggerShow, options) {
      options = angular.extend({}, defaultOptions, globalOptions, options);

      /**
       * Returns an object of show and hide triggers.
       *
       * If a trigger is supplied,
       * it is used to show the tooltip; otherwise, it will use the `trigger`
       * option passed to the `$tooltipProvider.options` method; else it will
       * default to the trigger supplied to this directive factory.
       *
       * The hide trigger is based on the show trigger. If the `trigger` option
       * was passed to the `$tooltipProvider.options` method, it will use the
       * mapped trigger from `triggerMap` or the passed trigger if the map is
       * undefined; otherwise, it uses the `triggerMap` value of the show
       * trigger; else it will just use the show trigger.
       */
      function getTriggers(trigger) {
        var show = (trigger || options.trigger || defaultTriggerShow).split(' ');
        var hide = show.map(function(trigger) {
          return triggerMap[trigger] || trigger;
        });
        return {
          show: show,
          hide: hide
        };
      }

      var directiveName = snake_case(type);

      var startSym = $interpolate.startSymbol();
      var endSym = $interpolate.endSymbol();
      var template =
        '<div '+ directiveName +'-popup '+
          'title="'+startSym+'title'+endSym+'" '+
          (options.useContentExp ?
            'content-exp="contentExp()" ' :
            'content="'+startSym+'content'+endSym+'" ') +
          'placement="'+startSym+'placement'+endSym+'" '+
          'popup-class="'+startSym+'popupClass'+endSym+'" '+
          'animation="animation" '+
          'is-open="isOpen"'+
          'origin-scope="origScope" '+
          'style="visibility: hidden; display: block;"'+
          '>'+
        '</div>';

      return {
        restrict: 'EA',
        compile: function(tElem, tAttrs) {
          var tooltipLinker = $compile(template);

          return function link(scope, element, attrs, tooltipCtrl) {
            var tooltip;
            var tooltipLinkedScope;
            var transitionTimeout;
            var popupTimeout;
            var positionTimeout;
            var appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : false;
            var triggers = getTriggers(undefined);
            var hasEnableExp = angular.isDefined(attrs[prefix + 'Enable']);
            var ttScope = scope.$new(true);
            var repositionScheduled = false;
            var isOpenExp = angular.isDefined(attrs[prefix + 'IsOpen']) ? $parse(attrs[prefix + 'IsOpen']) : false;

            var positionTooltip = function() {
              // check if tooltip exists and is not empty
              if (!tooltip || !tooltip.html()) { return; }

              if (!positionTimeout) {
                positionTimeout = $timeout(function() {
                  // Reset the positioning and box size for correct width and height values.
                  tooltip.css({ top: 0, left: 0, width: 'auto', height: 'auto', visibility: 'hidden' });

                  var ttBox = $position.position(tooltip);
                  var ttCss = $position.positionElements(element, tooltip, ttScope.placement, appendToBody);
                  ttCss.top += 'px';
                  ttCss.left += 'px';

                  ttCss.width = ttBox.width + 'px';
                  ttCss.height = ttBox.height + 'px';

                  ttCss.visibility = 'visible';

                  // Now set the calculated positioning and size.
                  tooltip.css(ttCss);

                  positionTimeout = null;

                }, 0, false);
              }
            };

            // Set up the correct scope to allow transclusion later
            ttScope.origScope = scope;

            // By default, the tooltip is not open.
            // TODO add ability to start tooltip opened
            ttScope.isOpen = false;
            openedTooltips.add(ttScope, {
              close: hideTooltipBind
            });

            function toggleTooltipBind() {
              if (!ttScope.isOpen) {
                showTooltipBind();
              } else {
                hideTooltipBind();
              }
            }

            // Show the tooltip with delay if specified, otherwise show it immediately
            function showTooltipBind() {
              if (hasEnableExp && !scope.$eval(attrs[prefix + 'Enable'])) {
                return;
              }

              prepareTooltip();

              if (ttScope.popupDelay) {
                // Do nothing if the tooltip was already scheduled to pop-up.
                // This happens if show is triggered multiple times before any hide is triggered.
                if (!popupTimeout) {
                  popupTimeout = $timeout(show, ttScope.popupDelay, false);
                }
              } else {
                show();
              }
            }

            function hideTooltipBind() {
              hide();
              if (!$rootScope.$$phase) {
                $rootScope.$digest();
              }
            }

            // Show the tooltip popup element.
            function show() {
              if (popupTimeout) {
                $timeout.cancel(popupTimeout);
                popupTimeout = null;
              }

              // If there is a pending remove transition, we must cancel it, lest the
              // tooltip be mysteriously removed.
              if (transitionTimeout) {
                $timeout.cancel(transitionTimeout);
                transitionTimeout = null;
              }

              // Don't show empty tooltips.
              if (!(options.useContentExp ? ttScope.contentExp() : ttScope.content)) {
                return angular.noop;
              }

              createTooltip();

              // And show the tooltip.
              ttScope.isOpen = true;
              if (isOpenExp && angular.isFunction(isOpenExp.assign)) {
                isOpenExp.assign(ttScope.origScope, ttScope.isOpen);
              }

              if (!$rootScope.$$phase) {
                ttScope.$apply(); // digest required as $apply is not called
              }

              positionTooltip();
            }

            // Hide the tooltip popup element.
            function hide() {
              if (!ttScope) {
                return;
              }

              // First things first: we don't show it anymore.
              ttScope.isOpen = false;
              if (isOpenExp && angular.isFunction(isOpenExp.assign)) {
                isOpenExp.assign(ttScope.origScope, ttScope.isOpen);
              }

              //if tooltip is going to be shown after delay, we must cancel this
              $timeout.cancel(popupTimeout);
              popupTimeout = null;

              $timeout.cancel(positionTimeout);
              positionTimeout = null;

              // And now we remove it from the DOM. However, if we have animation, we
              // need to wait for it to expire beforehand.
              // FIXME: this is a placeholder for a port of the transitions library.
              if (ttScope.animation) {
                if (!transitionTimeout) {
                  transitionTimeout = $timeout(removeTooltip, 500);
                }
              } else {
                removeTooltip();
              }
            }

            function createTooltip() {
              // There can only be one tooltip element per directive shown at once.
              if (tooltip) {
                removeTooltip();
              }
              tooltipLinkedScope = ttScope.$new();
              tooltip = tooltipLinker(tooltipLinkedScope, function(tooltip) {
                if (appendToBody) {
                  $document.find('body').append(tooltip);
                } else {
                  element.after(tooltip);
                }
              });

              if (options.useContentExp) {
                tooltipLinkedScope.$watch('contentExp()', function(val) {
                  if (!val && ttScope.isOpen) {
                    hide();
                  }
                });

                tooltipLinkedScope.$watch(function() {
                  if (!repositionScheduled) {
                    repositionScheduled = true;
                    tooltipLinkedScope.$$postDigest(function() {
                      repositionScheduled = false;
                      if (ttScope.isOpen) {
                        positionTooltip();
                      }
                    });
                  }
                });

              }
            }

            function removeTooltip() {
              transitionTimeout = null;
              if (tooltip) {
                tooltip.remove();
                tooltip = null;
              }
              if (tooltipLinkedScope) {
                tooltipLinkedScope.$destroy();
                tooltipLinkedScope = null;
              }
            }

            function prepareTooltip() {
              prepPopupClass();
              prepPlacement();
              prepPopupDelay();
            }

            ttScope.contentExp = function() {
              return scope.$eval(attrs[type]);
            };

            /**
             * Observe the relevant attributes.
             */
            if (!options.useContentExp) {
              attrs.$observe(type, function(val) {
                ttScope.content = val;

                if (!val && ttScope.isOpen) {
                  hide();
                } else {
                  positionTooltip();
                }
              });
            }

            attrs.$observe('disabled', function(val) {
              if (popupTimeout && val) {
                $timeout.cancel(popupTimeout);
                popupTimeout = null;
              }

              if (val && ttScope.isOpen) {
                hide();
              }
            });

            attrs.$observe(prefix + 'Title', function(val) {
              ttScope.title = val;
              positionTooltip();
            });

            attrs.$observe(prefix + 'Placement', function() {
              if (ttScope.isOpen) {
                prepPlacement();
                positionTooltip();
              }
            });

            if (isOpenExp) {
              scope.$watch(isOpenExp, function(val) {
                if (val !== ttScope.isOpen) {
                  toggleTooltipBind();
                }
              });
            }

            function prepPopupClass() {
              ttScope.popupClass = attrs[prefix + 'Class'];
            }

            function prepPlacement() {
              var val = attrs[prefix + 'Placement'];
              ttScope.placement = angular.isDefined(val) ? val : options.placement;
            }

            function prepPopupDelay() {
              var val = attrs[prefix + 'PopupDelay'];
              var delay = parseInt(val, 10);
              ttScope.popupDelay = !isNaN(delay) ? delay : options.popupDelay;
            }

            var unregisterTriggers = function() {
              triggers.show.forEach(function(trigger) {
                element.unbind(trigger, showTooltipBind);
              });
              triggers.hide.forEach(function(trigger) {
                trigger.split(' ').forEach(function(hideTrigger) {
                  element[0].removeEventListener(hideTrigger, hideTooltipBind);
                });
              });
            };

            function prepTriggers() {
              var val = attrs[prefix + 'Trigger'];
              unregisterTriggers();

              triggers = getTriggers(val);

              if (triggers.show !== 'none') {
                triggers.show.forEach(function(trigger, idx) {
                  // Using raw addEventListener due to jqLite/jQuery bug - #4060
                  if (trigger === triggers.hide[idx]) {
                    element[0].addEventListener(trigger, toggleTooltipBind);
                  } else if (trigger) {
                    element[0].addEventListener(trigger, showTooltipBind);
                    triggers.hide[idx].split(' ').forEach(function(trigger) {
                      element[0].addEventListener(trigger, hideTooltipBind);
                    });
                  }

                  element.on('keypress', function(e) {
                    if (e.which === 27) {
                      hideTooltipBind();
                    }
                  });
                });
              }
            }
            prepTriggers();

            var animation = scope.$eval(attrs[prefix + 'Animation']);
            ttScope.animation = angular.isDefined(animation) ? !!animation : options.animation;

            var appendToBodyVal = scope.$eval(attrs[prefix + 'AppendToBody']);
            appendToBody = angular.isDefined(appendToBodyVal) ? appendToBodyVal : appendToBody;

            // if a tooltip is attached to <body> we need to remove it on
            // location change as its parent scope will probably not be destroyed
            // by the change.
            if (appendToBody) {
              scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess() {
                if (ttScope.isOpen) {
                  hide();
                }
              });
            }

            // Make sure tooltip is destroyed and removed.
            scope.$on('$destroy', function onDestroyTooltip() {
              $timeout.cancel(transitionTimeout);
              $timeout.cancel(popupTimeout);
              $timeout.cancel(positionTimeout);
              unregisterTriggers();
              removeTooltip();
              ttScope = null;
            });
          };
        }
      };
    };
  }];
})

// This is mostly ngInclude code but with a custom scope
.directive('tooltipTemplateTransclude', [
         '$animate', '$sce', '$compile', '$templateRequest',
function ($animate ,  $sce ,  $compile ,  $templateRequest) {
  return {
    link: function(scope, elem, attrs) {
      var origScope = scope.$eval(attrs.tooltipTemplateTranscludeScope);

      var changeCounter = 0,
        currentScope,
        previousElement,
        currentElement;

      var cleanupLastIncludeContent = function() {
        if (previousElement) {
          previousElement.remove();
          previousElement = null;
        }
        if (currentScope) {
          currentScope.$destroy();
          currentScope = null;
        }
        if (currentElement) {
          $animate.leave(currentElement).then(function() {
            previousElement = null;
          });
          previousElement = currentElement;
          currentElement = null;
        }
      };

      scope.$watch($sce.parseAsResourceUrl(attrs.tooltipTemplateTransclude), function(src) {
        var thisChangeId = ++changeCounter;

        if (src) {
          //set the 2nd param to true to ignore the template request error so that the inner
          //contents and scope can be cleaned up.
          $templateRequest(src, true).then(function(response) {
            if (thisChangeId !== changeCounter) { return; }
            var newScope = origScope.$new();
            var template = response;

            var clone = $compile(template)(newScope, function(clone) {
              cleanupLastIncludeContent();
              $animate.enter(clone, elem);
            });

            currentScope = newScope;
            currentElement = clone;

            currentScope.$emit('$includeContentLoaded', src);
          }, function() {
            if (thisChangeId === changeCounter) {
              cleanupLastIncludeContent();
              scope.$emit('$includeContentError', src);
            }
          });
          scope.$emit('$includeContentRequested', src);
        } else {
          cleanupLastIncludeContent();
        }
      });

      scope.$on('$destroy', cleanupLastIncludeContent);
    }
  };
}])

/**
 * Note that it's intentional that these classes are *not* applied through $animate.
 * They must not be animated as they're expected to be present on the tooltip on
 * initialization.
 */
.directive('tooltipClasses', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if (scope.placement) {
        element.addClass(scope.placement);
      }
      if (scope.popupClass) {
        element.addClass(scope.popupClass);
      }
      if (scope.animation()) {
        element.addClass(attrs.tooltipAnimationClass);
      }
    }
  };
})

.directive('tooltipPopup', function() {
  return {
    restrict: 'EA',
    replace: true,
    scope: { content: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/tooltip/tooltip-popup.html'
  };
})

.directive('tooltip', [ '$tooltip', function($tooltip) {
  return $tooltip('tooltip', 'tooltip', 'mouseenter');
}])

.directive('tooltipTemplatePopup', function() {
  return {
    restrict: 'EA',
    replace: true,
    scope: { contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&',
      originScope: '&' },
    templateUrl: 'template/tooltip/tooltip-template-popup.html'
  };
})

.directive('tooltipTemplate', ['$tooltip', function($tooltip) {
  return $tooltip('tooltipTemplate', 'tooltip', 'mouseenter', {
    useContentExp: true
  });
}])

.directive('tooltipHtmlPopup', function() {
  return {
    restrict: 'EA',
    replace: true,
    scope: { contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/tooltip/tooltip-html-popup.html'
  };
})

.directive('tooltipHtml', ['$tooltip', function($tooltip) {
  return $tooltip('tooltipHtml', 'tooltip', 'mouseenter', {
    useContentExp: true
  });
}]);

/**
 * The following features are still outstanding: popup delay, animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, and selector delegatation.
 */
angular.module( 'ui.bootstrap.popover', ['ui.bootstrap.tooltip'])

.directive('popoverTemplatePopup', function() {
  return {
    restrict: 'EA',
    replace: true,
    scope: { title: '@', contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&',
      originScope: '&' },
    templateUrl: 'template/popover/popover-template.html'
  };
})

.directive('popoverTemplate', ['$tooltip', function($tooltip) {
  return $tooltip('popoverTemplate', 'popover', 'click', {
    useContentExp: true
  });
}])

.directive('popoverHtmlPopup', function() {
  return {
    restrict: 'EA',
    replace: true,
    scope: { contentExp: '&', title: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/popover/popover-html.html'
  };
})

.directive('popoverHtml', ['$tooltip', function($tooltip) {
  return $tooltip( 'popoverHtml', 'popover', 'click', {
    useContentExp: true
  });
}])

.directive('popoverPopup', function() {
  return {
    restrict: 'EA',
    replace: true,
    scope: { title: '@', content: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/popover/popover.html'
  };
})

.directive('popover', ['$tooltip', function($tooltip) {
  return $tooltip( 'popover', 'popover', 'click' );
}]);

angular.module('ui.bootstrap.progressbar', [])

.constant('progressConfig', {
  animate: true,
  max: 100
})

.value('$progressSuppressWarning', false)

.controller('ProgressController', ['$scope', '$attrs', 'progressConfig', function($scope, $attrs, progressConfig) {
  var self = this,
      animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;

  this.bars = [];
  $scope.max = angular.isDefined($scope.max) ? $scope.max : progressConfig.max;

  this.addBar = function(bar, element, attrs) {
    if (!animate) {
      element.css({'transition': 'none'});
    }

    this.bars.push(bar);

    bar.max = $scope.max;
    bar.title = attrs && angular.isDefined(attrs.title) ? attrs.title : 'progressbar';

    bar.$watch('value', function(value) {
      bar.recalculatePercentage();
    });

    bar.recalculatePercentage = function() {
      bar.percent = +(100 * bar.value / bar.max).toFixed(2);

      var totalPercentage = self.bars.reduce(function(total, bar) {
        return total + bar.percent;
      }, 0);

      if (totalPercentage > 100) {
        bar.percent -= totalPercentage - 100;
      }
    };

    bar.$on('$destroy', function() {
      element = null;
      self.removeBar(bar);
    });
  };

  this.removeBar = function(bar) {
      this.bars.splice(this.bars.indexOf(bar), 1);
  };

  $scope.$watch('max', function(max) {
    self.bars.forEach(function(bar) {
      bar.max = $scope.max;
      bar.recalculatePercentage();
    });
  });
}])

.directive('uibProgress', function() {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    controller: 'ProgressController',
    require: 'uibProgress',
    scope: {
      max: '=?'
    },
    templateUrl: 'template/progressbar/progress.html'
  };
})

.directive('progress', ['$log', '$progressSuppressWarning', function($log, $progressSuppressWarning) {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    controller: 'ProgressController',
    require: 'progress',
    scope: {
      max: '=?',
      title: '@?'
    },
    templateUrl: 'template/progressbar/progress.html',
    link: function() {
      if (!$progressSuppressWarning) {
        $log.warn('progress is now deprecated. Use uib-progress instead');
      }
    }
  };
}])

.directive('uibBar', function() {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    require: '^uibProgress',
    scope: {
      value: '=',
      type: '@'
    },
    templateUrl: 'template/progressbar/bar.html',
    link: function(scope, element, attrs, progressCtrl) {
      progressCtrl.addBar(scope, element, attrs);
    }
  };
})

.directive('bar', ['$log', '$progressSuppressWarning', function($log, $progressSuppressWarning) {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    require: '^progress',
    scope: {
      value: '=',
      type: '@'
    },
    templateUrl: 'template/progressbar/bar.html',
    link: function(scope, element, attrs, progressCtrl) {
      if (!$progressSuppressWarning) {
        $log.warn('bar is now deprecated. Use uib-bar instead');
      }
      progressCtrl.addBar(scope, element);
    }
  };
}])

.directive('progressbar', function() {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    controller: 'ProgressController',
    scope: {
      value: '=',
      max: '=?',
      type: '@'
    },
    templateUrl: 'template/progressbar/progressbar.html',
    link: function(scope, element, attrs, progressCtrl) {
      progressCtrl.addBar(scope, angular.element(element.children()[0]), {title: attrs.title});
    }
  };
});

angular.module('ui.bootstrap.rating', [])

.constant('ratingConfig', {
  max: 5,
  stateOn: null,
  stateOff: null,
  titles : ['one', 'two', 'three', 'four', 'five']
})

.controller('RatingController', ['$scope', '$attrs', 'ratingConfig', function($scope, $attrs, ratingConfig) {
  var ngModelCtrl  = { $setViewValue: angular.noop };

  this.init = function(ngModelCtrl_) {
    ngModelCtrl = ngModelCtrl_;
    ngModelCtrl.$render = this.render;

    ngModelCtrl.$formatters.push(function(value) {
      if (angular.isNumber(value) && value << 0 !== value) {
        value = Math.round(value);
      }
      return value;
    });

    this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
    this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;
    var tmpTitles = angular.isDefined($attrs.titles)  ? $scope.$parent.$eval($attrs.titles) : ratingConfig.titles ;    
    this.titles = angular.isArray(tmpTitles) && tmpTitles.length > 0 ?
      tmpTitles : ratingConfig.titles;
    
    var ratingStates = angular.isDefined($attrs.ratingStates) ?
      $scope.$parent.$eval($attrs.ratingStates) :
      new Array(angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max);
    $scope.range = this.buildTemplateObjects(ratingStates);
  };

  this.buildTemplateObjects = function(states) {
    for (var i = 0, n = states.length; i < n; i++) {
      states[i] = angular.extend({ index: i }, { stateOn: this.stateOn, stateOff: this.stateOff, title: this.getTitle(i) }, states[i]);
    }
    return states;
  };
  
  this.getTitle = function(index) {
    if (index >= this.titles.length) {
      return index + 1;
    } else {
      return this.titles[index];
    }
  };
  
  $scope.rate = function(value) {
    if (!$scope.readonly && value >= 0 && value <= $scope.range.length) {
      ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue === value ? 0 : value);
      ngModelCtrl.$render();
    }
  };

  $scope.enter = function(value) {
    if (!$scope.readonly) {
      $scope.value = value;
    }
    $scope.onHover({value: value});
  };

  $scope.reset = function() {
    $scope.value = ngModelCtrl.$viewValue;
    $scope.onLeave();
  };

  $scope.onKeydown = function(evt) {
    if (/(37|38|39|40)/.test(evt.which)) {
      evt.preventDefault();
      evt.stopPropagation();
      $scope.rate($scope.value + (evt.which === 38 || evt.which === 39 ? 1 : -1));
    }
  };

  this.render = function() {
    $scope.value = ngModelCtrl.$viewValue;
  };
}])

.directive('rating', function() {
  return {
    restrict: 'EA',
    require: ['rating', 'ngModel'],
    scope: {
      readonly: '=?',
      onHover: '&',
      onLeave: '&'
    },
    controller: 'RatingController',
    templateUrl: 'template/rating/rating.html',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];
      ratingCtrl.init( ngModelCtrl );
    }
  };
});


/**
 * @ngdoc overview
 * @name ui.bootstrap.tabs
 *
 * @description
 * AngularJS version of the tabs directive.
 */

angular.module('ui.bootstrap.tabs', [])

.controller('TabsetController', ['$scope', function TabsetCtrl($scope) {
  var ctrl = this,
      tabs = ctrl.tabs = $scope.tabs = [];

  ctrl.select = function(selectedTab) {
    angular.forEach(tabs, function(tab) {
      if (tab.active && tab !== selectedTab) {
        tab.active = false;
        tab.onDeselect();
        selectedTab.selectCalled = false;
      }
    });
    selectedTab.active = true;
    // only call select if it has not already been called
    if (!selectedTab.selectCalled) {
      selectedTab.onSelect();
      selectedTab.selectCalled = true;
    }
  };

  ctrl.addTab = function addTab(tab) {
    tabs.push(tab);
    // we can't run the select function on the first tab
    // since that would select it twice
    if (tabs.length === 1 && tab.active !== false) {
      tab.active = true;
    } else if (tab.active) {
      ctrl.select(tab);
    } else {
      tab.active = false;
    }
  };

  ctrl.removeTab = function removeTab(tab) {
    var index = tabs.indexOf(tab);
    //Select a new tab if the tab to be removed is selected and not destroyed
    if (tab.active && tabs.length > 1 && !destroyed) {
      //If this is the last tab, select the previous tab. else, the next tab.
      var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
      ctrl.select(tabs[newActiveIndex]);
    }
    tabs.splice(index, 1);
  };

  var destroyed;
  $scope.$on('$destroy', function() {
    destroyed = true;
  });
}])

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tabset
 * @restrict EA
 *
 * @description
 * Tabset is the outer container for the tabs directive
 *
 * @param {boolean=} vertical Whether or not to use vertical styling for the tabs.
 * @param {boolean=} justified Whether or not to use justified styling for the tabs.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <tabset>
      <tab heading="Tab 1"><b>First</b> Content!</tab>
      <tab heading="Tab 2"><i>Second</i> Content!</tab>
    </tabset>
    <hr />
    <tabset vertical="true">
      <tab heading="Vertical Tab 1"><b>First</b> Vertical Content!</tab>
      <tab heading="Vertical Tab 2"><i>Second</i> Vertical Content!</tab>
    </tabset>
    <tabset justified="true">
      <tab heading="Justified Tab 1"><b>First</b> Justified Content!</tab>
      <tab heading="Justified Tab 2"><i>Second</i> Justified Content!</tab>
    </tabset>
  </file>
</example>
 */
.directive('tabset', function() {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    scope: {
      type: '@'
    },
    controller: 'TabsetController',
    templateUrl: 'template/tabs/tabset.html',
    link: function(scope, element, attrs) {
      scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
      scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
    }
  };
})

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tab
 * @restrict EA
 *
 * @param {string=} heading The visible heading, or title, of the tab. Set HTML headings with {@link ui.bootstrap.tabs.directive:tabHeading tabHeading}.
 * @param {string=} select An expression to evaluate when the tab is selected.
 * @param {boolean=} active A binding, telling whether or not this tab is selected.
 * @param {boolean=} disabled A binding, telling whether or not this tab is disabled.
 *
 * @description
 * Creates a tab with a heading and content. Must be placed within a {@link ui.bootstrap.tabs.directive:tabset tabset}.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <div ng-controller="TabsDemoCtrl">
      <button class="btn btn-small" ng-click="items[0].active = true">
        Select item 1, using active binding
      </button>
      <button class="btn btn-small" ng-click="items[1].disabled = !items[1].disabled">
        Enable/disable item 2, using disabled binding
      </button>
      <br />
      <tabset>
        <tab heading="Tab 1">First Tab</tab>
        <tab select="alertMe()">
          <tab-heading><i class="icon-bell"></i> Alert me!</tab-heading>
          Second Tab, with alert callback and html heading!
        </tab>
        <tab ng-repeat="item in items"
          heading="{{item.title}}"
          disabled="item.disabled"
          active="item.active">
          {{item.content}}
        </tab>
      </tabset>
    </div>
  </file>
  <file name="script.js">
    function TabsDemoCtrl($scope) {
      $scope.items = [
        { title:"Dynamic Title 1", content:"Dynamic Item 0" },
        { title:"Dynamic Title 2", content:"Dynamic Item 1", disabled: true }
      ];

      $scope.alertMe = function() {
        setTimeout(function() {
          alert("You've selected the alert tab!");
        });
      };
    };
  </file>
</example>
 */

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tabHeading
 * @restrict EA
 *
 * @description
 * Creates an HTML heading for a {@link ui.bootstrap.tabs.directive:tab tab}. Must be placed as a child of a tab element.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <tabset>
      <tab>
        <tab-heading><b>HTML</b> in my titles?!</tab-heading>
        And some content, too!
      </tab>
      <tab>
        <tab-heading><i class="icon-heart"></i> Icon heading?!?</tab-heading>
        That's right.
      </tab>
    </tabset>
  </file>
</example>
 */
.directive('tab', ['$parse', function($parse) {
  return {
    require: '^tabset',
    restrict: 'EA',
    replace: true,
    templateUrl: 'template/tabs/tab.html',
    transclude: true,
    scope: {
      active: '=?',
      heading: '@',
      onSelect: '&select', //This callback is called in contentHeadingTransclude
                          //once it inserts the tab's content into the dom
      onDeselect: '&deselect'
    },
    controller: function() {
      //Empty controller so other directives can require being 'under' a tab
    },
    link: function(scope, elm, attrs, tabsetCtrl, transclude) {
      scope.$watch('active', function(active) {
        if (active) {
          tabsetCtrl.select(scope);
        }
      });

      scope.disabled = false;
      if (attrs.disable) {
        scope.$parent.$watch($parse(attrs.disable), function(value) {
          scope.disabled = !! value;
        });
      }

      scope.select = function() {
        if (!scope.disabled) {
          scope.active = true;
        }
      };

      tabsetCtrl.addTab(scope);
      scope.$on('$destroy', function() {
        tabsetCtrl.removeTab(scope);
      });

      //We need to transclude later, once the content container is ready.
      //when this link happens, we're inside a tab heading.
      scope.$transcludeFn = transclude;
    }
  };
}])

.directive('tabHeadingTransclude', function() {
  return {
    restrict: 'A',
    require: '^tab',
    link: function(scope, elm, attrs, tabCtrl) {
      scope.$watch('headingElement', function updateHeadingElement(heading) {
        if (heading) {
          elm.html('');
          elm.append(heading);
        }
      });
    }
  };
})

.directive('tabContentTransclude', function() {
  return {
    restrict: 'A',
    require: '^tabset',
    link: function(scope, elm, attrs) {
      var tab = scope.$eval(attrs.tabContentTransclude);

      //Now our tab is ready to be transcluded: both the tab heading area
      //and the tab content area are loaded.  Transclude 'em both.
      tab.$transcludeFn(tab.$parent, function(contents) {
        angular.forEach(contents, function(node) {
          if (isTabHeading(node)) {
            //Let tabHeadingTransclude know.
            tab.headingElement = node;
          } else {
            elm.append(node);
          }
        });
      });
    }
  };

  function isTabHeading(node) {
    return node.tagName && (
      node.hasAttribute('tab-heading') ||
      node.hasAttribute('data-tab-heading') ||
      node.hasAttribute('x-tab-heading') ||
      node.tagName.toLowerCase() === 'tab-heading' ||
      node.tagName.toLowerCase() === 'data-tab-heading' ||
      node.tagName.toLowerCase() === 'x-tab-heading'
    );
  }
});

angular.module('ui.bootstrap.timepicker', [])

.constant('timepickerConfig', {
  hourStep: 1,
  minuteStep: 1,
  showMeridian: true,
  meridians: null,
  readonlyInput: false,
  mousewheel: true,
  arrowkeys: true,
  showSpinners: true
})

.controller('TimepickerController', ['$scope', '$attrs', '$parse', '$log', '$locale', 'timepickerConfig', function($scope, $attrs, $parse, $log, $locale, timepickerConfig) {
  var selected = new Date(),
      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
      meridians = angular.isDefined($attrs.meridians) ? $scope.$parent.$eval($attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS;

  this.init = function(ngModelCtrl_, inputs) {
    ngModelCtrl = ngModelCtrl_;
    ngModelCtrl.$render = this.render;

    ngModelCtrl.$formatters.unshift(function(modelValue) {
      return modelValue ? new Date(modelValue) : null;
    });

    var hoursInputEl = inputs.eq(0),
        minutesInputEl = inputs.eq(1);

    var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepickerConfig.mousewheel;
    if (mousewheel) {
      this.setupMousewheelEvents(hoursInputEl, minutesInputEl);
    }

    var arrowkeys = angular.isDefined($attrs.arrowkeys) ? $scope.$parent.$eval($attrs.arrowkeys) : timepickerConfig.arrowkeys;
    if (arrowkeys) {
      this.setupArrowkeyEvents(hoursInputEl, minutesInputEl);
    }

    $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : timepickerConfig.readonlyInput;
    this.setupInputEvents(hoursInputEl, minutesInputEl);
  };

  var hourStep = timepickerConfig.hourStep;
  if ($attrs.hourStep) {
    $scope.$parent.$watch($parse($attrs.hourStep), function(value) {
      hourStep = parseInt(value, 10);
    });
  }

  var minuteStep = timepickerConfig.minuteStep;
  if ($attrs.minuteStep) {
    $scope.$parent.$watch($parse($attrs.minuteStep), function(value) {
      minuteStep = parseInt(value, 10);
    });
  }

  var min;
  $scope.$parent.$watch($parse($attrs.min), function(value) {
    var dt = new Date(value);
    min = isNaN(dt) ? undefined : dt;
  });

  var max;
  $scope.$parent.$watch($parse($attrs.max), function(value) {
    var dt = new Date(value);
    max = isNaN(dt) ? undefined : dt;
  });

  $scope.noIncrementHours = function() {
    var incrementedSelected = addMinutes(selected, hourStep * 60);
    return incrementedSelected > max ||
      (incrementedSelected < selected && incrementedSelected < min);
  };

  $scope.noDecrementHours = function() {
    var decrementedSelected = addMinutes(selected, -hourStep * 60);
    return decrementedSelected < min ||
      (decrementedSelected > selected && decrementedSelected > max);
  };

  $scope.noIncrementMinutes = function() {
    var incrementedSelected = addMinutes(selected, minuteStep);
    return incrementedSelected > max ||
      (incrementedSelected < selected && incrementedSelected < min);
  };

  $scope.noDecrementMinutes = function() {
    var decrementedSelected = addMinutes(selected, -minuteStep);
    return decrementedSelected < min ||
      (decrementedSelected > selected && decrementedSelected > max);
  };

  $scope.noToggleMeridian = function() {
    if (selected.getHours() < 13) {
      return addMinutes(selected, 12 * 60) > max;
    } else {
      return addMinutes(selected, -12 * 60) < min;
    }
  };

  // 12H / 24H mode
  $scope.showMeridian = timepickerConfig.showMeridian;
  if ($attrs.showMeridian) {
    $scope.$parent.$watch($parse($attrs.showMeridian), function(value) {
      $scope.showMeridian = !!value;

      if (ngModelCtrl.$error.time) {
        // Evaluate from template
        var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
        if (angular.isDefined(hours) && angular.isDefined(minutes)) {
          selected.setHours(hours);
          refresh();
        }
      } else {
        updateTemplate();
      }
    });
  }

  // Get $scope.hours in 24H mode if valid
  function getHoursFromTemplate() {
    var hours = parseInt($scope.hours, 10);
    var valid = $scope.showMeridian ? (hours > 0 && hours < 13) : (hours >= 0 && hours < 24);
    if (!valid) {
      return undefined;
    }

    if ($scope.showMeridian) {
      if (hours === 12) {
        hours = 0;
      }
      if ($scope.meridian === meridians[1]) {
        hours = hours + 12;
      }
    }
    return hours;
  }

  function getMinutesFromTemplate() {
    var minutes = parseInt($scope.minutes, 10);
    return (minutes >= 0 && minutes < 60) ? minutes : undefined;
  }

  function pad(value) {
    return (angular.isDefined(value) && value.toString().length < 2) ? '0' + value : value.toString();
  }

  // Respond on mousewheel spin
  this.setupMousewheelEvents = function(hoursInputEl, minutesInputEl) {
    var isScrollingUp = function(e) {
      if (e.originalEvent) {
        e = e.originalEvent;
      }
      //pick correct delta variable depending on event
      var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
      return (e.detail || delta > 0);
    };

    hoursInputEl.bind('mousewheel wheel', function(e) {
      $scope.$apply(isScrollingUp(e) ? $scope.incrementHours() : $scope.decrementHours());
      e.preventDefault();
    });

    minutesInputEl.bind('mousewheel wheel', function(e) {
      $scope.$apply(isScrollingUp(e) ? $scope.incrementMinutes() : $scope.decrementMinutes());
      e.preventDefault();
    });

  };

  // Respond on up/down arrowkeys
  this.setupArrowkeyEvents = function(hoursInputEl, minutesInputEl) {
    hoursInputEl.bind('keydown', function(e) {
      if (e.which === 38) { // up
        e.preventDefault();
        $scope.incrementHours();
        $scope.$apply();
      } else if (e.which === 40) { // down
        e.preventDefault();
        $scope.decrementHours();
        $scope.$apply();
      }
    });

    minutesInputEl.bind('keydown', function(e) {
      if (e.which === 38) { // up
        e.preventDefault();
        $scope.incrementMinutes();
        $scope.$apply();
      } else if (e.which === 40) { // down
        e.preventDefault();
        $scope.decrementMinutes();
        $scope.$apply();
      }
    });
  };

  this.setupInputEvents = function(hoursInputEl, minutesInputEl) {
    if ($scope.readonlyInput) {
      $scope.updateHours = angular.noop;
      $scope.updateMinutes = angular.noop;
      return;
    }

    var invalidate = function(invalidHours, invalidMinutes) {
      ngModelCtrl.$setViewValue(null);
      ngModelCtrl.$setValidity('time', false);
      if (angular.isDefined(invalidHours)) {
        $scope.invalidHours = invalidHours;
      }
      if (angular.isDefined(invalidMinutes)) {
        $scope.invalidMinutes = invalidMinutes;
      }
    };

    $scope.updateHours = function() {
      var hours = getHoursFromTemplate(),
        minutes = getMinutesFromTemplate();

      if (angular.isDefined(hours) && angular.isDefined(minutes)) {
        selected.setHours(hours);
        if (selected < min || selected > max) {
          invalidate(true);
        } else {
          refresh('h');
        }
      } else {
        invalidate(true);
      }
    };

    hoursInputEl.bind('blur', function(e) {
      if (!$scope.invalidHours && $scope.hours < 10) {
        $scope.$apply(function() {
          $scope.hours = pad($scope.hours);
        });
      }
    });

    $scope.updateMinutes = function() {
      var minutes = getMinutesFromTemplate(),
        hours = getHoursFromTemplate();

      if (angular.isDefined(minutes) && angular.isDefined(hours)) {
        selected.setMinutes(minutes);
        if (selected < min || selected > max) {
          invalidate(undefined, true);
        } else {
          refresh('m');
        }
      } else {
        invalidate(undefined, true);
      }
    };

    minutesInputEl.bind('blur', function(e) {
      if (!$scope.invalidMinutes && $scope.minutes < 10) {
        $scope.$apply(function() {
          $scope.minutes = pad($scope.minutes);
        });
      }
    });

  };

  this.render = function() {
    var date = ngModelCtrl.$viewValue;

    if (isNaN(date)) {
      ngModelCtrl.$setValidity('time', false);
      $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
    } else {
      if (date) {
        selected = date;
      }

      if (selected < min || selected > max) {
        ngModelCtrl.$setValidity('time', false);
        $scope.invalidHours = true;
        $scope.invalidMinutes = true;
      } else {
        makeValid();
      }
      updateTemplate();
    }
  };

  // Call internally when we know that model is valid.
  function refresh(keyboardChange) {
    makeValid();
    ngModelCtrl.$setViewValue(new Date(selected));
    updateTemplate(keyboardChange);
  }

  function makeValid() {
    ngModelCtrl.$setValidity('time', true);
    $scope.invalidHours = false;
    $scope.invalidMinutes = false;
  }

  function updateTemplate(keyboardChange) {
    var hours = selected.getHours(), minutes = selected.getMinutes();

    if ($scope.showMeridian) {
      hours = (hours === 0 || hours === 12) ? 12 : hours % 12; // Convert 24 to 12 hour system
    }

    $scope.hours = keyboardChange === 'h' ? hours : pad(hours);
    if (keyboardChange !== 'm') {
      $scope.minutes = pad(minutes);
    }
    $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
  }

  function addMinutes(date, minutes) {
    var dt = new Date(date.getTime() + minutes * 60000);
    var newDate = new Date(date);
    newDate.setHours(dt.getHours(), dt.getMinutes());
    return newDate;
  }

  function addMinutesToSelected(minutes) {
    selected = addMinutes(selected, minutes);
    refresh();
  }

  $scope.showSpinners = angular.isDefined($attrs.showSpinners) ?
    $scope.$parent.$eval($attrs.showSpinners) : timepickerConfig.showSpinners;

  $scope.incrementHours = function() {
    if (!$scope.noIncrementHours()) {
      addMinutesToSelected(hourStep * 60);
    }
  };

  $scope.decrementHours = function() {
    if (!$scope.noDecrementHours()) {
      addMinutesToSelected(-hourStep * 60);
    }
  };

  $scope.incrementMinutes = function() {
    if (!$scope.noIncrementMinutes()) {
      addMinutesToSelected(minuteStep);
    }
  };

  $scope.decrementMinutes = function() {
    if (!$scope.noDecrementMinutes()) {
      addMinutesToSelected(-minuteStep);
    }
  };

  $scope.toggleMeridian = function() {
    if (!$scope.noToggleMeridian()) {
      addMinutesToSelected(12 * 60 * (selected.getHours() < 12 ? 1 : -1));
    }
  };
}])

.directive('timepicker', function() {
  return {
    restrict: 'EA',
    require: ['timepicker', '?^ngModel'],
    controller:'TimepickerController',
    controllerAs: 'timepicker',
    replace: true,
    scope: {},
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/timepicker/timepicker.html';
    },
    link: function(scope, element, attrs, ctrls) {
      var timepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (ngModelCtrl) {
        timepickerCtrl.init(ngModelCtrl, element.find('input'));
      }
    }
  };
});

angular.module('ui.bootstrap.typeahead', ['ui.bootstrap.position'])

/**
 * A helper service that can parse typeahead's syntax (string provided by users)
 * Extracted to a separate service for ease of unit testing
 */
    .factory('typeaheadParser', ['$parse', function ($parse) {

      //                      00000111000000000000022200000000000000003333333333333330000000000044000
      var TYPEAHEAD_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;

      return {
        parse:function (input) {

          var match = input.match(TYPEAHEAD_REGEXP), modelMapper, viewMapper, source;
          if (!match) {
            throw new Error(
                'Expected typeahead specification in form of \'_modelValue_ (as _label_)? for _item_ in _collection_\'' +
                ' but got \'' + input + '\'.');
          }

          return {
            itemName:match[3],
            source:$parse(match[4]),
            viewMapper:$parse(match[2] || match[1]),
            modelMapper:$parse(match[1])
          };
        }
      };
    }])

    .directive('typeahead', ['$compile', '$parse', '$q', '$timeout', '$document', '$position', 'typeaheadParser',
      function ($compile, $parse, $q, $timeout, $document, $position, typeaheadParser) {

        var HOT_KEYS = [9, 13, 27, 38, 40];

        return {
          require:'ngModel',
          link:function (originalScope, element, attrs, modelCtrl) {

            //SUPPORTED ATTRIBUTES (OPTIONS)

            //minimal no of characters that needs to be entered before typeahead kicks-in
            var minSearch = originalScope.$eval(attrs.typeaheadMinLength);
            minSearch = minSearch === 0 ? minSearch : minSearch || 1;

            //minimal wait time after last character typed before typehead kicks-in
            var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

            //should it restrict model values to the ones selected from the popup only?
            var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

            //binding to a variable that indicates if matches are being retrieved asynchronously
            var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

            //a callback executed when a match is selected
            var onSelectCallback = $parse(attrs.typeaheadOnSelect);

            var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

            //INTERNAL VARIABLES

            //model setter executed upon match selection
            var $setModelValue = $parse(attrs.ngModel).assign;

            //expressions used by typeahead
            var parserResult = typeaheadParser.parse(attrs.typeahead);

            var hasFocus;

            //pop-up element used to display matches
            var popUpEl = angular.element('<div typeahead-popup></div>');
            popUpEl.attr({
              matches: 'matches',
              active: 'activeIdx',
              select: 'select(activeIdx)',
              query: 'query',
              position: 'position'
            });
            //custom item template
            if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
              popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
            }

            //create a child scope for the typeahead directive so we are not polluting original scope
            //with typeahead-specific data (matches, query etc.)
            var scope = originalScope.$new();
            originalScope.$on('$destroy', function(){
              scope.$destroy();
            });

            var resetMatches = function() {
              scope.matches = [];
              scope.activeIdx = -1;
            };

            var getMatchesAsync = function(inputValue) {

              var locals = {$viewValue: inputValue};
              isLoadingSetter(originalScope, true);
              $q.when(parserResult.source(originalScope, locals)).then(function(matches) {

                //it might happen that several async queries were in progress if a user were typing fast
                //but we are interested only in responses that correspond to the current view value
                // Commented by sarath for popup display when inbox focusing
//          if ((inputValue === modelCtrl.$viewValue && hasFocus) || angular.isUndefined(modelCtrl.$viewValue) || modelCtrl.$viewValue === '' || modelCtrl.$viewValue === null) {
                if (hasFocus) {
                  if (matches.length > 0) {

                    scope.activeIdx = 0;
                    scope.matches.length = 0;

                    //transform labels
                    for(var i=0; i<matches.length; i++) {
                      locals[parserResult.itemName] = matches[i];
                      scope.matches.push({
                        label: parserResult.viewMapper(scope, locals),
                        model: matches[i]
                      });
                    }

                    scope.query = inputValue;
                    //position pop-up with matches - we need to re-calculate its position each time we are opening a window
                    //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
                    //due to other elements being rendered
                    scope.position = $position.position(element);
                    scope.position.top = scope.position.top + element.prop('offsetHeight');

                  } else {
                    resetMatches();
                  }
                  isLoadingSetter(originalScope, false);
                }
              }, function(){
                resetMatches();
                isLoadingSetter(originalScope, false);
              });
            };

            resetMatches();

            //we need to propagate user's query so we can higlight matches
            scope.query = undefined;

            //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
            var timeoutPromise;

            //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
            //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
            modelCtrl.$parsers.unshift(function (inputValue) {

              hasFocus = true;

              if (minSearch === 0 || inputValue && inputValue.length >= minSearch) {
                if (waitTime > 0) {
                  if (timeoutPromise) {
                    $timeout.cancel(timeoutPromise);//cancel previous timeout
                  }
                  timeoutPromise = $timeout(function () {
                    getMatchesAsync(inputValue);
                  }, waitTime);
                } else {
                  getMatchesAsync(inputValue);
                }
              } else {
                isLoadingSetter(originalScope, false);
                resetMatches();
              }

              if (isEditable) {
                return inputValue;
              } else {
                if (!inputValue) {
                  // Reset in case user had typed something previously.
                  modelCtrl.$setValidity('editable', true);
                  return inputValue;
                } else {
                  modelCtrl.$setValidity('editable', false);
                  return undefined;
                }
              }
            });

            modelCtrl.$formatters.push(function (modelValue) {

              var candidateViewValue, emptyViewValue;
              var locals = {};

              if (inputFormatter) {

                locals['$model'] = modelValue;
                return inputFormatter(originalScope, locals);

              } else {

                //it might happen that we don't have enough info to properly render input value
                //we need to check for this situation and simply return model value if we can't apply custom formatting
                locals[parserResult.itemName] = modelValue;
                candidateViewValue = parserResult.viewMapper(originalScope, locals);
                locals[parserResult.itemName] = undefined;
                emptyViewValue = parserResult.viewMapper(originalScope, locals);

                return candidateViewValue!== emptyViewValue ? candidateViewValue : modelValue;
              }
            });

            scope.select = function (activeIdx) {
              //called from within the $digest() cycle
              var locals = {};
              var model, item;

              locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
              model = parserResult.modelMapper(originalScope, locals);
              $setModelValue(originalScope, model);
              modelCtrl.$setValidity('editable', true);

              onSelectCallback(originalScope, {
                $item: item,
                $model: model,
                $label: parserResult.viewMapper(originalScope, locals)
              });

              resetMatches();

              //return focus to the input element if a match was selected via a mouse click event
              element[0].focus();
            };

            //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
            element.bind('keydown', function (evt) {

              //typeahead is open and an "interesting" key was pressed
              if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
                // if (evt.which === 13) {
                //   evt.preventDefault();
                // }
                return;
              }

              evt.preventDefault();

              if (evt.which === 40) {
                scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
                scope.$digest();

              } else if (evt.which === 38) {
                scope.activeIdx = (scope.activeIdx ? scope.activeIdx : scope.matches.length) - 1;
                scope.$digest();

              } else if (evt.which === 13 || evt.which === 9) {
                scope.$apply(function () {
                  scope.select(scope.activeIdx);
                });

              } else if (evt.which === 27) {
                evt.stopPropagation();

                resetMatches();
                scope.$digest();
              }
            });

            element.bind('blur', function (evt) {
              hasFocus = false;
            });
            //open selection when typeahead-min-length="0"
            element.bind('focus', function (evt) {
              hasFocus = true;
              if(minSearch === 0){
                getMatchesAsync('');
              }
            });
            // Keep reference to click handler to unbind it.
            var dismissClickHandler = function (evt) {
              if (element[0] !== evt.target) {
                resetMatches();
                scope.$digest();
              }
            };

            $document.bind('mousedown', dismissClickHandler);

            originalScope.$on('$destroy', function(){
              $document.unbind('mousedown', dismissClickHandler);
            });

            element.after($compile(popUpEl)(scope));
          }
        };

      }])

    .directive('typeaheadPopup', function () {
      return {
        restrict:'EA',
        scope:{
          matches:'=',
          query:'=',
          active:'=',
          position:'=',
          select:'&'
        },
        replace:true,
        templateUrl:'template/typeahead/typeahead-popup.html',
        link:function (scope, element, attrs) {

          scope.templateUrl = attrs.templateUrl;

          scope.isOpen = function () {
            return scope.matches.length > 0;
          };

          scope.isActive = function (matchIdx) {
            return scope.active == matchIdx;
          };

          scope.selectActive = function (matchIdx) {
            scope.active = matchIdx;
          };

          scope.selectMatch = function (activeIdx) {
            scope.select({activeIdx:activeIdx});
          };
        }
      };
    })

    .directive('typeaheadMatch', ['$http', '$templateCache', '$compile', '$parse', function ($http, $templateCache, $compile, $parse) {
      return {
        restrict:'EA',
        scope:{
          index:'=',
          match:'=',
          query:'='
        },
        link:function (scope, element, attrs) {
          var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
          $http.get(tplUrl, {cache: $templateCache}).success(function(tplContent){
            element.replaceWith($compile(tplContent.trim())(scope));
          });
        }
      };
    }])

    .filter('typeaheadHighlight', function() {

      function escapeRegexp(queryToEscape) {
        return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
      }

      return function(matchItem, query) {
        return query ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
      };
    });!angular.$$csp() && angular.element(document).find('head').prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>');