# This Readme serves as a documentantion for this project. It is incomplete but it contains fixes for most common problems

# Android emulator can not connect with localhost backend
How to fix:
1. Launch the app(I tested this with "react-native run-android" command)
2. Wait for everything to boot up
3. When emulator is working and you can see the app open command prompt
4. Type this command into the cmd: "adb reverse tcp:5500 tcp:5500"
5. It should work now. At leat for me it works