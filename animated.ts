import { Animated, Easing } from "react-native"

class CommonAnimated {
    state: any
    animated: any
    constructor(props?: any) {
        props = props || {}
        this.state = {
            opacityList: props.opacityList || [0, 1],
            duration: props.duration || 300,
            easing: props.easing || Easing.elastic(0.8)
        }
    }

    getState() {
        return {
            ...this.state
        }
    }

    // @ts-ignore
    setState(key, value) {
        this.state[key] = value
    }

    stop() {
        if (this.animated) {
            this.animated.stop()
            this.animated = null
        }
    }
    /* tslint:disable:no-empty */
    toIn() {}

    /* tslint:disable:no-empty */
    toOut() {}
}

export class FadeAnimated extends CommonAnimated {
    constructor(props?: any) {
        props = props || {}
        super(props)
        this.state = {
            ...this.state,
            scaleList: [0, 1],
            translateXList: [null, null],
            translateYList: [null, null],
            ...props
        }

        this.state.opacity = new Animated.Value(
            this.getPropertyValue("opacity", true)
        )
        this.state.scale = new Animated.Value(
            this.getPropertyValue("scale", true)
        )

        this.state.translateX = new Animated.Value(
            this.getPropertyValue("translateX", true)
        )
        this.state.translateY = new Animated.Value(
            this.getPropertyValue("translateY", true)
        )
    }

    // @ts-ignore
    getPropertyValue(type, tag) {
        let value
        if (tag) {
            value = this.state[type + "List"][0]
        } else {
            value = this.state[type + "List"][1]
        }
        return value || 0 // 兼容为 null 的情况
    }

    toIn() {
        return this.fade(true)
    }

    toOut() {
        return this.fade(false)
    }

    reset(params: any) {
        const ret = {}
        params.forEach((paramItem: any) => {
            const key = paramItem.key + "List"
            const tmp = this.state[key].concat()
            tmp.splice(0, 1, paramItem.value)
            // @ts-ignore
            ret[key] = tmp
        })

        this.state = {
            ...this.state,
            ...ret
        }
    }

    fade(tag: boolean) {
        this.stop()
        this.state.opacity.setValue(this.getPropertyValue("opacity", tag))
        this.state.scale.setValue(this.getPropertyValue("scale", tag))
        this.state.translateX.setValue(this.getPropertyValue("translateX", tag))
        this.state.translateY.setValue(this.getPropertyValue("translateY", tag))

        return new Promise(resolve => {
            const invalid = ["translateXList", "translateYList"].some(key => {
                return this.state[key][0] == null
            })
            if (invalid) {
                setTimeout(() => {
                    resolve("pre animated end")
                    // console.log('pre animated end')
                }, 100)
            } else {
                resolve("pre animated end")
            }
        })
            .then(() => {
                this.state.translateX.setValue(
                    this.getPropertyValue("translateX", tag)
                )
                this.state.translateY.setValue(
                    this.getPropertyValue("translateY", tag)
                )

                this.animated = Animated.parallel([
                    Animated.timing(this.state.opacity, {
                        toValue: this.getPropertyValue("opacity", !tag),
                        duration:
                            this.state.opacityDuration || this.state.duration,
                        easing: this.state.easing,
                        useNativeDriver: true
                    }),
                    Animated.timing(this.state.scale, {
                        toValue: this.getPropertyValue("scale", !tag),
                        duration:
                            this.state.scaleDuration || this.state.duration,
                        easing: this.state.easing,
                        useNativeDriver: true
                    }),
                    Animated.timing(this.state.translateX, {
                        toValue: this.getPropertyValue("translateX", !tag),
                        duration: this.state.duration,
                        easing: this.state.easing,
                        useNativeDriver: true
                    }),
                    Animated.timing(this.state.translateY, {
                        toValue: this.getPropertyValue("translateY", !tag),
                        duration: this.state.duration,
                        easing: this.state.easing,
                        useNativeDriver: true
                    })
                ])
            })
            .then(() => {
                return new Promise(resolve => {
                    this.animated.start(() => {
                        resolve("animated end")
                    })
                }).catch(e => {
                    console.log(e)
                })
            })
    }
}

export class SlideAnimated extends CommonAnimated {
    constructor(props?: any) {
        props = props || {}
        super(props)

        this.state = {
            ...this.state,
            directionType: ["horizontal"],
            translateYList: [null, 0],
            translateXList: [null, 0],
            ...props
        }

        this.state.opacity = new Animated.Value(
            this.getPropertyValue("opacity", true)
        )
        this.state.translateY = new Animated.Value(
            this.getPropertyValue("translateY", true)
        )
        this.state.translateX = new Animated.Value(
            this.getPropertyValue("translateX", true)
        )
    }

    reset(params: any) {
        const map = {
            vertical: "translateYList",
            horizontal: "translateXList"
        }
        const ret = {}
        params.forEach((paramItem: any) => {
            // @ts-ignore
            const key = map[paramItem.directionTypeItem]
            const tmp = this.state[key].concat()
            tmp.splice(0, 1, paramItem.size)
            // @ts-ignore
            ret[key] = tmp
        })

        this.state = {
            ...this.state,
            ...ret
        }
    }

    // @ts-ignore
    getPropertyValue(type, tag) {
        const tmp = tag
            ? this.state[type + "List"][0]
            : this.state[type + "List"][1]
        return tmp == null ? 0 : tmp
    }

    toIn() {
        return this.slide(true)
    }

    toOut() {
        return this.slide(false)
    }

    slide(tag: boolean) {
        this.stop()
        this.state.opacity.setValue(this.getPropertyValue("opacity", tag))

        const map = {
            vertical: "translateY",
            horizontal: "translateX"
        }
        const keys = this.state.directionType.map((item: any) => {
            // @ts-ignore
            return map[item]
        })
        keys.forEach((key: any) => {
            this.state[key].setValue(this.getPropertyValue(key, tag))
        })
        return new Promise(resolve => {
            const invalid = keys.some((key: any) => {
                return this.state[key + "List"][0] == null
            })

            if (invalid) {
                setTimeout(() => {
                    // console.log('setTimeout 100 resolve')
                    resolve("pre animated end")
                }, 100)
            } else {
                resolve("pre animated end")
            }
        })
            .then(ret => {
                keys.forEach((key: any) => {
                    this.state[key].setValue(this.getPropertyValue(key, tag))
                })

                const parallelArray = keys.map((key: any) => {
                    return Animated.timing(this.state[key], {
                        toValue: this.getPropertyValue(key, !tag),
                        duration: this.state.duration,
                        easing: this.state.easing,
                        useNativeDriver: true
                    })
                })

                this.animated = Animated.parallel([
                    Animated.timing(this.state.opacity, {
                        toValue: this.getPropertyValue("opacity", !tag),
                        duration: this.state.duration,
                        easing: this.state.easing,
                        useNativeDriver: true
                    }),
                    ...parallelArray
                ])

                return new Promise(resolve => {
                    this.animated.start(() => {
                        resolve("animated end")
                    })
                })
            })
            .catch(e => {
                console.log(e)
            })
    }
}

export class EmptyAnimated extends CommonAnimated {
    constructor(props?: any) {
        props = props || {}
        super(props)
        this.state.opacity = new Animated.Value(1)
        this.state.scale = new Animated.Value(1)
        this.state.translateX = new Animated.Value(0)
        this.state.translateY = new Animated.Value(0)
    }

    reset() {}

    toIn() {
        return this.run()
    }

    toOut() {
        return this.run()
    }

    run() {
        this.stop()
        return new Promise(resolve => {
            resolve("animated end")
        })
    }
}
