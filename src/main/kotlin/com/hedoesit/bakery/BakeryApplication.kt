package com.hedoesit.bakery

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BakeryApplication

fun main(args: Array<String>) {
    runApplication<BakeryApplication>(*args)
}
