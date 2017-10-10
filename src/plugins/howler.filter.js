/*!
 *  Filters Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
 *  
 *  howler.js v2.0.4
 *  howlerjs.com
 *
 *  (c) 2013-2017, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */
(function() {
    
      'use strict';
      
      /** Global Methods **/
      /***************************************************************************/
    
      HowlerGlobal.prototype.qFactor = function(q) {
        var self = this;
    
        // Stop right here if not using Web Audio.
        if (!self.ctx || !self.ctx.listener) {
          return self;
        }
    
        // Loop through all Howls and update their q.
        for (var i=self._howls.length-1; i>=0; i--) {
          self._howls[i].qFactor(q);
        }
    
        return self;
      };
    
      HowlerGlobal.prototype.frequency = function(f) {
        var self = this;
    
        // Stop right here if not using Web Audio.
        if (!self.ctx || !self.ctx.listener) {
          return self;
        }
    
        // Loop through all Howls and update their q.
        for (var i=self._howls.length-1; i>=0; i--) {
          self._howls[i].frequency(f);
        }
    
        return self;
      };
    
      HowlerGlobal.prototype.filterType = function(type) {
        var self = this;
    
        // Stop right here if not using Web Audio.
        if (!self.ctx || !self.ctx.listener) {
          return self;
        }
    
        // Loop through all Howls and update their q.
        for (var i=self._howls.length-1; i>=0; i--) {
          self._howls[i].filterType(type);
        }
    
        return self;
      };
    
      /** Group Methods **/
      /***************************************************************************/
    
      /**
       * Add new properties to the core init.
       * @param  {Function} _super Core init method.
       * @return {Howl}
       */
      Howl.prototype.init = (function(_super) {
        return function(o) {
          var self = this;

          self._q = o.qFactor || 1.0;
          self._filterType = o.filterType || 'lowpass';
          self._frequency = o.frequency || 1000.0;
    
          // Complete initilization with howler.js core's init function.
          return _super.call(this, o);
        };
      })(Howl.prototype.init);
    
      Howl.prototype.qFactor = function(q, id) {
        var self = this;
    
        // Stop right here if not using Web Audio.
        if (!self._webAudio) {
          return self;
        }
    
        // If the sound hasn't loaded, add it to the load queue to change q when capable.
        if (self._state !== 'loaded') {
          self._queue.push({
            event: 'qFactor',
            action: function() {
              self.qFactor(q, id);
            }
          });
    
          return self;
        }

        if (typeof id === 'undefined') {
          if (typeof q === 'number') {
            self._q = q;
          } else {
            return self._q;
          }
        }

        var ids = self._getSoundIds(id);
        for (var i=0; i<ids.length; i++) {
          // Get the sound.
          var sound = self._soundById(ids[i]);
    
          if (sound) {
            if (typeof q === 'number') {
              if (sound._node) {
                self._q = q;
                if (!sound._filterNode) {
                  setupFilter(sound);
                }

                sound._filterNode.Q.value = q;
              }
            } else {
              return sound._q;
            }
          }
        }
    
        return self;
      };
      Howl.prototype.filterType = function(type, id) {
        var self = this;
    
        // Stop right here if not using Web Audio.
        if (!self._webAudio) {
          return self;
        }
    
        // If the sound hasn't loaded, add it to the load queue to change q when capable.
        if (self._state !== 'loaded') {
          self._queue.push({
            event: 'filterType',
            action: function() {
              self.filterType(type, id);
            }
          });
    
          return self;
        }

        if (typeof id === 'undefined') {
          if (type === 'lowpass' ||
              type === 'highpass'||
              type === 'bandpass'||
              type === 'notch') {
            self._filterType = type;
          } else {
            return self._filterType;
          }
        }

        var ids = self._getSoundIds(id);
        for (var i=0; i<ids.length; i++) {
          // Get the sound.
          var sound = self._soundById(ids[i]);
    
          if (sound) {
            if (type === 'lowpass' ||
                type === 'highpass'||
                type === 'bandpass'||
                type === 'notch') {
              sound._filterType = type;
    
              if (sound._node) {
    
                if (!sound._filterNode) {
                  setupFilter(sound);
                }

                sound._filterNode.type = type;
              }
            } else {
              return sound._q;
            }
          }
        }
    
        return self;
      };

      Howl.prototype.frequency = function(f, id) {
        var self = this;
    
        // Stop right here if not using Web Audio.
        if (!self._webAudio) {
          return self;
        }
    
        // If the sound hasn't loaded, add it to the load queue to change q when capable.
        if (self._state !== 'loaded') {
          self._queue.push({
            event: 'frequency',
            action: function() {
              self.frequency(f, id);
            }
          });
    
          return self;
        }

        if (typeof id === 'undefined') {
          if (typeof f === 'number'){
            self._frequency = f;
          } else {
            return self._frequency;
          }
        }

        var ids = self._getSoundIds(id);
        for (var i=0; i<ids.length; i++) {
          // Get the sound.
          var sound = self._soundById(ids[i]);
    
          if (sound) {
            if (typeof f === 'number'){
              sound._frequency = f;
    
              if (sound._node) {
    
                if (!sound._filterNode) {
                  setupFilter(sound);
                }

                sound._filterNode.frequency.value = f;
              }
            } else {
              return sound._q;
            }
          }
        }
    
        return self;
      };

      Howl.prototype.addFilter = function(filterParams, id) {
        var self = this;
    
        // Stop right here if not using Web Audio.
        if (!self._webAudio) {
          return self;
        }
    
        // If the sound hasn't loaded, add it to the load queue to change q when capable.
        if (self._state !== 'loaded') {
          self._queue.push({
            event: 'addFilter',
            action: function() {
              self.addFilter(filterParams, id);
            }
          });
    
          return self;
        }

        var ids = self._getSoundIds(id);
        for (var i=0; i<ids.length; i++) {
          // Get the sound.
          var sound = self._soundById(ids[i]);
    
          if (sound) {
              if (sound._node) {
    
                if (!sound._filterNode) {
                  setupFilter(sound);
                }
                sound._filterNode.frequency.value = filterParams.frequency || sound._frequency;
                sound._filterNode.Q.value = filterParams.Q || sound._q;
                sound._filterNode.type = filterParams.filterType || sound._filterType;
              }
          }
        }
    
        return self;
      };
    
      /** Single Sound Methods **/
      /***************************************************************************/
    
      /**
       * Add new properties to the core Sound init.
       * @param  {Function} _super Core Sound init method.
       * @return {Sound}
       */
      Sound.prototype.init = (function(_super) {
        return function() {
          var self = this;
          var parent = self._parent;
    
          // Setup user-defined default properties.
          self._q = parent._q;
          self._filterType = parent._filterType;
          self._frequency = parent._frequency;
    
          // Complete initilization with howler.js core Sound's init function.
          _super.call(this);
        };
      })(Sound.prototype.init);
    
      /**
       * Override the Sound.reset method to clean up properties from the spatial plugin.
       * @param  {Function} _super Sound reset method.
       * @return {Sound}
       */
      Sound.prototype.reset = (function(_super) {
        return function() {
          var self = this;
          var parent = self._parent;
    
          // Reset all spatial plugin properties on this sound.
          self._q = parent._q;
          self._filterType = parent._filterType;
          self._frequency = parent._frequency;
    
          // Complete resetting of the sound.
          return _super.call(this);
        };
      })(Sound.prototype.reset);
    
      /** Helper Methods **/
      /***************************************************************************/

      var setupFilter = function(sound) {
        // Create the new convolver send gain node.
        sound._filterNode = Howler.ctx.createBiquadFilter();
        // set default gain node values
        sound._filterNode.gain.value = 1.0;
        sound._filterNode.frequency.value = sound._frequency || 1000.0;
        sound._filterNode.type = sound._filterType || "lowpass";
        sound._filterNode.Q.value = sound._q || 1.0;
        // connect sound's gain node to convolver send gain node
        sound._fxInsertIn.disconnect();
        sound._fxInsertIn.connect(sound._filterNode);
        sound._filterNode.connect(sound._fxInsertOut);
        // Update the connections.
        if (!sound._paused) {
          sound._parent.pause(sound._id, true).play(sound._id);
        }
      };
    })();
    