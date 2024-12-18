package com.xapp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "xapp"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      object : ReactActivityDelegate(this, mainComponentName) {
        override fun createRootView(): ReactRootView =
            RNGestureHandlerEnabledRootView(this@MainActivity)
      }
}
