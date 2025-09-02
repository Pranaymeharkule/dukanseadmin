import React from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const ViewOrder = () => {
  const navigate = useNavigate();

  const order = {
    id: "#ODN000000123",
    items: [
      {
        name: "Aashirvaad Chakki Atta",
        qty: 1,
        weight: "10 kg",
        price: "₹ 450",
        img: "data:image/jpeg;base64,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",
      },
      {
        name: "Happilo Cashew Nuts",
        qty: 1,
        weight: "200 g",
        price: "₹ 300",
        img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSEhIVFRUXGBgVFRYXFR0VGBYVGBUXFhcWGRYYHi0gGBolGxUVITEiJSkrLy4uFx8zODMsNyktLisBCgoKDg0OGxAQGy4lHyUvLystMC0tMi4tLi0tLS0vLS0rLS03LS0tLS0rLS0tLS0tNS0rLS0tLS0tLS0tLS0vLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABQYDBAcBAgj/xABNEAABAwIDAwcFDgQCCQUAAAABAAIDBBEFEiExQVEGEyJhcYGRBzKhscEVFyMzQlJTVHKCk9HS8BRikrLC8SRjZHOio7PT4RYlQ0SD/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAECBAMFBv/EAC0RAAICAQIDBgYDAQAAAAAAAAABAhEDITESEzIEIkFxobEUUVJhgZFCwdE0/9oADAMBAAIRAxEAPwDuKIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgNbEK+KCMyzSNjYNrnGw10A13ngq2PKVhV7fxR/Bm/7aovlwrnmphgv0GRc7bcXvc9t7cQGW+8eK5uw6rtHGmrZ2jjTVs/Q3vh4Z9ZP4Mv6F774WG/WD+DL+hcKavsKyxIssSO5e+Fhv1g/gy/oT3wsN+sH8GX9C4cinkxJ5MTuPvhYb9YP4Mv6E98LDfrB/Bl/QuHInJiOTE7j74WG/WD+DL+hPfCw36wfwZf0LhyJyYjkxO4++Fhv1g/gy/oT3wsN+sH8GX9C4cicmI5MTuPvhYb9YP4Mv6F574WG/WD+DL+hcOXhTkxI5MTuXviYZ9ZP4Mv6Eh8omFudkFW0Hi9kkbe972ho7yuFOKjnHVV5SI5SP1c1wIuDcHUHiF6qX5Iqhz8NjDjfI6Rjepocco7Bew6gFdFxap0cWqdBERQQEREAREQBERAEREAREQHEfLc3/Tozxp2+iSX81QGwu+a7q0OvBdE8uLf9LgP+p9UjvzXP466VoAbLIANgDyAOwX0WqPSjVHpRtxggC4IPWLLIFijnc/V7i47Lk3PiVlCsiyPURFYsEREAREQBERAeLxerwqGQzDMdCo9blWdFpqqIR3vyOt/9sjPGSY+Erh7FdlTvJG22FwfamPjPIris0+pmWfUwiIqlQiIgCIiAIiIAiIgCIiA5V5WcLdU1cEUbSZOYc8HdlbJY5uAu5uouddm8c+i5PSDSWOVp2jKGPBabW+Vt2q8+W2fJPTlo6ZjeA7e0Bwvl4E3Gu0W02rljnEm5JJ4k3WiF8KNML4UWSjwU72zdfRZw459depbnuJ/LOeJ5tnVoBn7dVV6R5vtK3g48T4q1MtTJKbBpsxyRSFu4uAB2a3AJG26+Pceo+hf4LTDjxK3n4VUiVkDopGyvtkYQWucDex13aHU7LG9rK2pOp8+41R9C/wAE9x6j6F/gvnFKKanldDNdr22uM19oDhqDbYQtXnDxPip1J1Nz3GqPoX+Ce41R9C/wWnzh4nxTOeJ8U1Gpue49R9E5Pcao+hd4LSMh4nxWWohkZbO17Li4zNc244i+0daajU2Pcao+id6PzXy7Bqj6I+I/NaZceJ8V8PUOyHZ9VeDVH0R8R+awMwSoJsIj4t/NS9LyT52NkpqI4w85Wh4td1gbDXXaFB4xhvMTPhJDi3Qm1tbKkZJukznHInLhT1O/+TWmdHhtOx4s4B9xwvK87lZ1WfJq22GUv2CfF7irMs8t2cJbsIiKCAiIgCIiAIiIAiIgCIiA495dh8NSH+Sb0Oi/NcvXVPLu34SjP8s3riXK1ph0o1Q6UZITqFIhRjSpJh0VyxcPJjhYmrWucLthaZTwzAhrB4nN9xX7DMOlkxWoqpo3NZGxsVOXCwIt0nN78+vCRV/yMho/inEi9ou5o5w37PyUjya5Wc5R1ctROC9jpC0dFpbGYxzYaABe7rgbSSuM7bZxnbbK5/6SqsRfLWB0bGyyPMXOEgvaCQ0iwNhlAA7OC12eTmrMoiLoh0BI92Y2YCSA09G5PRds06J1V9fLBJJRPhqoG00GYlvOAOc4xc1E0N3WD33vrs04bGLM5+kqualjaZs8bZHOswAAREZhfTov2bynMkOZI5JW8l6mOrbRlodI62Qg9FzTc5rkaAZXX4ZStjlNyOqKJjZJHMexxyksJOV1r2IIG2x16l1Wjlp5qtj45Wyvp4HMkc0ggc65mUlw0v8ABSabsx4qHnqKeODmKqpikfNViUBjw7K11U2QXPyWho1JsNo13zzGTzGMDwDLHR0ssEYtepndfM4uY4ZGno6Eue3eRaNzdQovlJyfq8SmdURmNsTLx07XuIMjWk5ngAWs5wNibXAG7VWfFMep2Crk55mdjGx2DgXXyuc3KL6nNKRp81YZaynM9NOyrp200Eb7M50AlzmhjejuDW369SLKib3KJu7OLVRJe67Qw3N2gWDTexFt1lryFSfKGpZJVTyR+Y+V7m7rguJvbr296iak6FaDQTtFykpRDFHLA+QxnMCHBovZoItfUdEKCx7EBPUSTNBAeQbG1xoL7OtR68CpGCUrRzhijGTkt2fpHyetthtJ/uWHxF/arCoPkM22HUY/2eL+wKcWeW7OEt2ERFBAREQBERAEREAREQBERAcm8uzdaQ/74f8ASXJ113y7Do0n2pfVGuRtaSQACSdABqSdwA3rTDpRpx9KAUjAdAvY8AqiQBA/U2Gmz7Xze+ynTyRnY22ZjnfNGYdwc4Brj1XVXnxreSL2RDHkXsSLixsbXB2g9SkqKKllAZI408g0EljJE77bfOjJ+cLjqCjC0gkEWINiDoQRtBHFF2q0TRP1XIysaM7I2zxnZJA4StcOoDpehTeI4gwYMyle17JmvAMbo3NNhK5+Y3GzKdvFU/DsTngOaGV8Z35XEA9o2O7wrLS+UmvYLOMUvW+PX/llo9Co1Io1IzeTPGoKc1QmdlzsYW6E3LOcu0WG3piw7VXMP5O1cthHTSnryFrf6nWHpVkk8qFZujpm9eRx/wAaiq3ldiNT0eeksfkwtyelgzHvKd5NsJSuz2o5NMpta2drHboIbSzHqPyI+0khQtdOxxHNxCNo0Avmcet7zq4+AG4DVZ4sEqnbIJNd5aW373WupGl5GVj/AJDGfaeP8N1V5sceqS/ZdL5ldWrWO0V0l5HNjHw9dTRn5ubMf+ItUPXUGHsNnVb3n+Rlh45SPSqvtEPC35JkXZV15dTD5qIGzIpHn+Z1vQD7FKYTWyi/8PhjXHc4xl3pyj1rn8RL6H+Wl/YO4ckm2oaUf7PD/wBNqllqYTm5iLOA13NszAbA7KLgd621XcyMIiIQEREAREQBERAEREAREQHNfLVQSyx03Nsc/K6S9hewLW7fBUDkpg0hkeXAscGHIdL5ibG3WASup+VGmnfFFzEvN2e7NqRcZdmg4rmVFhdSHh4qdQb65nAnrFxcLNm7RV43KK/d/wCGnH0Fjos7CGBpG7S43gau7767bKWgkc5wY4sDyfNDgd1/Y7wWjNQiUh5bd2/KdDoARYm9tOtSPuQ1zJAMzM+mZoDXAHaBcHaNL9a85OO1jxKrjGDRumkkdWQjM4m1wT39IarTbhtEPPqyfsM/K6lpuTdLHcHnHW1N3fJABJ0AuBmGxZafC6MWPMF1wHAlziC0mwPnd+u5bfi0kkpy/Civc6WRTG4Uza6ok9Hsas0WM4WzRlC55/nfe/i5ytLaGnjLctNCQWuObK05SMobe41aS7U307LkS9LiTGuDY2AAAEnRgsS4aW62HbZR8VF/U/OVexWUioQY9J/9bBmN4HmnPHaS1jfWszq7GX7IWRDqa1voe8n0K2SYyXNu1mhc1rdSSb5M2gAsQH37GuO5atXLLlYGbTFm1bc5hl2k7NC7bre266pPOvoX5tlVJFVfheJyfGVIb2Ot/Y0etZqXkO6X42se4bCAC7ZoRdzj6lK1MM7vlkauG0C4DwGnTizMeokLZoqB7iMz+jmBIuXXGcOtrs0FvvHgL812ua2aXkkWbdEf739JGLkyv7XBo8GNB9Ki6rAKVh0hb967v7iVdo6TmogwG9t9rXNgCT1kgnvVdrxtVM2fI/5MrFvxK86FrSMrQ3sAHqViwB2h7lAVO1TeAnQ9vsWGL11LvY6dB5rewepfa+YxoOwL6X0q2MYREUgIiIAiIgCIiAIiIAiIgK9y0beJv2vYVzeDzj2n1rp3Kxt4h2+wrmA0kcOsrwe2/wDS/JGrF0E/QOU6R0Qq/QFWGPzUjsQ9yExGjDi51zctyfdPnDv0/pCwxU7ALHYbNAJtYZrho37fUtPFyYnEdJxbJzzLuJvE5khlZ/NltJZuwXiGlgsEL/iyzbJLKQ5ouLZZLP4eY0HXfbiqSi73Lpqiyl0cbHPf5rGuc7Qu6Nsz9Bt2HSylaWljGyNg+6Ose0+J4qkVNY+SCQ5v/je1zRaxYaEylxG453t1HUN5VnwqQvme8uN2l7A0E2ylzC1xGwXDQ4HUnO7WwVlBpW2VbRLVVfbMGxySZfPyZeiSA6xzuFzYg2bc6jiL6tXUsDspe0OsXWvrlG0222XsMj4nSMdE9zXPMkb2AOvn1cxwvdrg6+p6Ni3W9wImWhlc8ufG0i84LXPFpBKBlvlDtA1scevBxsRa9nFFEY6jEWh484A82AMpBLpJHRC7XC4AIGum3sWejxQZ7ZTluBnuMtiJDfu5vwe071pPwt3nOfraK1yX5ebnM1i51i/TI3MdTludVihqKSJgilqYw0FpAL2g2a7MBYanZYneFEYxbpanTWiUkxWSSBkuTIxwjc45c5jD4myEObcGwLgC4XtfUWuRH4gNStet5ZYZHGI2ufJk2BrHEX+0+wd4kbOCrlXy15wnmaZ7usn2NB9a0y7LlktI156e5WKa3NurUvgR6J7fYFSZ6utk2RiMHiACP6jf0KVwnknWzgF9U9rb6huYg7OtoXGPZO93pr8av0LtqjugXqIvbMYREQBERAEREAREQBERAEREBBcsKyKKEOlkaxpdlBcbAuLSba77A+C5PNisHOOIlZa+3MutcrsCjrIRFILgPDx0nN6Qa4Xu032OK51L5Oo2vcOjYH58n5rBn7NCeTialf2qvU0Y5pR1Pikx6mG2dnipmLljQBtjUDuY8+pq0Gcg6VurmA/fk/NZoeT+HjT+Gaesl3tKo8eCGj4vQsu9satfysoHEOzlzm3DTzbrgOtmAuN9h4KKi5V0kYa1rH2aLNAY0BoAsALnTTRWyl5J0b75YYweqMPt2klSsXI6mjANm8dI2C3oKoseGWqjJ+ckjpajoUGLl3C34umcTYNGrW6DYOjfTqW5Hy0rnfFYc88DllkHflYFbzG2MEt7t3qWbDazO/JsPAak8TcnTr7EjPCpUsav7ybJcXV0VL3Tx+TRtNHEOORrbd0shPoWCTBsak+NrGsG/K/KfCNgHpXR6ugD7AyPaBty/mfyWm+ani+DLSbHpA6m53njuXV5JR2jFL50Ujrt7HOXcinPPw9Y6Q8LE9wL3H1KUwrkHRHz+ckG8mQgf8sBWuZlG+1oyCd7CWEdehtfuKYNSBuaxzWcQHb3NBIFxuPZ1qqzZpOuPT7aexd7eIp+SFFGBkp4gR8rLnd/U+5XxPhkY3X77egKZBs22y3X+a06la444S1kr89fcySbsjG0zG+axo7Br4qUwzzfvfktB6kcLHRH2vaF2SS0RzLCiIpAREQBERAEREAREQBERAEREBiqNneq/W/GO/e4Kwz7FX674x3d6ggNCocSNFA1s7Y2kuOnpJ4ADaVYLGx3H96qJFJmcHEbOI29y83tMWzbgaW5ZeT0IZAwDaWtc48XOAJ19Hct2ogEjS128bjYjgQRqCofCcRBBjdo5uzddu63q/zC3zUi249uqmE4cNeBEoy4rIebktNfo1eZu4SM6Q7XNOvgFvYHhEsDnOe9j7tsA2/R1BO3uX3NiLxsFzuAFyezetLmsQL2Pa1rQHah7wMzToRpc3sdLjbZc0sfFcIu/Yu3NxqTXobeIvc4+dwAA2cSVXuU+IiLKDcuLRYAXc4XNrcQAdp0U/iDajdEH8cjgNOxxF+wLXiDZCC9lnRjJq2zgNDY32bPSku9a1Jg6plOhxGoeQIoS1zjlYDq51zs4N0vrutddDwqj5mNrHOzO1J1uBfaAd4Gy6gsVrGwgPHyTbTb0ujYdxPcCvmmxmMgEzNG/V2U+DtQueOUcb1L5FKa02LI8cD1dq1qoLBRVYfqw3HHUX7AfWvqdxXo4ZpoxZItGs9SWFDRv2vao1ylMKGjPtf4loOJOoiIAiIgCIiAIiIAiIgCIiAIiIDHPsVfxA/CO7v7QrBPsVYxtxDyQOF/6QqydKyUrdHwXBYZ3BoLnEADaeC1GzE6qSwqmDzneLhp6IOwu23t1evsWOc3N0jRFcOrNXC8Ilkfzrmc3GWkAP8AOdcgh2UeaNN9tq358Jnv8HMxo4PjL7d4cPapaSbr61jp6gOLrbgPSqLFBd0vzZvU+Yg2IWaATbV50JPE8B1LA+sdrr4fv92WrWTnf++5aJqw0Xc4Dft3DeepVlkrRbEqF6kt/FXWvVgyssD09rDxPzD1HZ1HvWvTYhFIBkfcnUAgtdpro0jXuuvqZ2Wyq56EqNFGfPUzPY6SGRkOp1aSG2B1cRsO7XirTR4PC4Nke513WsABoLaXvtOzxVho5g7UNuL9Lhci57duxas1Hr8GQbXIaBsG0AWO4HhuVOUtGtS7zN6bGrI3mhoQW/JIFr93HZ4qOOIEuyDU+obzfgpRxbIwxvcW3sQ4AEtIJN+8EjvWlKIom5YgTfa46kkbz+wBwXZXejpHN1Wq1PRVC+UqwYUOiztP9xVNuS6/WrphDejGP3vWzFJy3M2SNEyiIuxzCIiAIiIAiIgCIiAIiIAiIgMc/m+HrVdxeRrXOc8hrQASSbAC20k7FYp/NP73rm3lWilLIjHms2aNz7fNs4A27bd9kJirdG9TtgnJ5qRjyNSGuBI3ajarBh8IaxrQLAX9JJXC48XniHOtktKyxzO1NgS4M6m9ItLQTt262V65UcpZhN/DwNkHwUcw5sgOcX3JaSbGwFthHyuABpLDT0O/C9i+V82RhPAXN9mg0/fUqhQY8Iqgl5uyQZXHU5DfM15G8Xvf7XVZYeTPKsyyCmqMxMmdoEgs9rmsDi1xAs4FhJB2jrv0YmSqgjePNI1+NcQHlps42aQWs2W869wTa9lhy4MnNVeB3g4qLUi44xXNa246ZPmNZ0i86bLbtRc7FXafDZpSHzCxvcM2gcAbaE7+23C5sWETwzxXbEISNCwADK7ztrNHA8eIN7EELf8A4Z1jZpdbw8dAFxnjd6lo5OFFedQOAuTs2ce0diwVOIyhpYcrnWcWk6WIaSL227LblKYi2b5MRcBvBa70B11GUWES1BOZjombHOe0tJG9rGmxPboNd+xcXB3UUdIyVXIm+T8j3U8eboktDiL6BztSL95W7CQHHXXaLfmvJcrGhrLgD029qxRnb3f5LRFcNI4PXU1pLZnAbA4gdl9i1Z2rE+RznlzSRck6da36Whcek6/er44uT0Im1FGOkpbdI7dw4f8AlWXCxozv9qiHtsprDBozs/NehGKiqMbdskkRFYgIiIAiIgCIiAIiIAiIgC8svUQEdiAmGsYDv5SbX77aKtYliNyRUU0sYIyk5edYfvR3NustCuy8IQHMafk1RTkkSCVnymXa7fexdbMN/wDNt1W5yt5K/wAR8PC34YNDDldkcWAkjKbgBwJ322DUb7pV4LTy6yQscdxyi47CNQtYYCG/FTzR9WcSjwmDrd1kLKbRzvBeSFRHNFNIZTzJeQJHBxcXMyix4C53DZ1qv1OATwTSsc1ozNkDC92Vj4pnZrg/OY64IPHaBquz/wAPVt2PgkHB0bmO73NcR/wrFUGdws+la77Ewd6Htaq95S4jqsz2KN5OcNljZO6QENc6NkVzfMyJhbzgsTo4m/bdXOSU5MoOmv5+1aE8Un1epb2ZD/ZIteOR7CTzNQQdHAxPJ7dm0arJkhOUm6OnHF+JttkIOhtt9X/lZTVOtt/eq031J3Qz/gSfpX0JJDsp5z/+eX+4hc1CfyZPFH5mR5J1J8dSsM7tMo852g9pWQQVJ82mkH2nsb6nErYo8MqgcxjhB4ukc+3VlawetWjhm3sQ8kUbGGYUGgEhbNSywT3PqXefVZOqGJrdO2XOfCy+DyZp3ayh85/10jpB3MJyjuC2xioqkZpSbZXavG6cOyiTnH3tkiaZnA8CIwcv3rKSoauqla0MpnQtAHSkcM3cxtwP6u5WOnpI2CzGNaBua0AehZlYqa9NG4DpG5Wey9RAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAf/Z",
      },
      {
        name: "India Gate Basmati Rice",
        qty: 1,
        weight: "10 kg",
        price: "₹ 1000",
        img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTEhIVFhUVFRUWFRUYFxgWFRYVFxYXGRYXFRcYHSggGBolGxYWITEhJSkrMC4uGB8zODMtNygtLi0BCgoKDg0OGxAQGy8mHyUvLS4vLysvLS8tLS8vLystNS0tLS8tLS8tKy4tLS8yLSs1LS0tKy0tNS0vMi0tLy0tLf/AABEIAPsAyQMBIgACEQEDEQH/xAAcAAABBAMBAAAAAAAAAAAAAAAAAwQFBgECBwj/xABMEAACAQIEAgUGCQkGBgIDAAABAgMAEQQSITEFQQYTIlFhMnGBkZLSByNCUlNik6HRFBVyoqOxwdPwJDNDY4KyFlSz4eLxNMIXRKT/xAAZAQEAAwEBAAAAAAAAAAAAAAAAAQIDBAX/xAAwEQACAgECBAIKAgMBAAAAAAAAAQIRAyExBBJBURNhBRQicYGRobHR8FLBFTLhcv/aAAwDAQACEQMRAD8A7jRRVX6d4ySJIikjJeQqxDFbjKTa4B7qAtFFc0Ti0un9ofT/ADj7mtOI+KyfTt9sfc0oDodFUeLi0n0p+1PuU+g4w3NgfPKfcoC1UVBJxj9D7U+5Sq8U/R+0/wDGgJiioteJ/ofaf+NbjiX6Htn3aAkaKj/zh+h7Z92tvy/9H2j7tAPqKY/l/wCj7Te7R+XD6vtN7lAPqKY/lw+r7Te5WDxAfV9b+5QD+io48R83rf8Al1o3EfN+v/LoCUoqGbih/oP/AC6Ql4s3In2X/l0BYKKqcvGJeTt7B/l02fjU/wBK/wBl/wCFAXWiqG/HMT9M/wBiPdo4fxzEmeJDMxVpFDAxKLgnUXtpQF8ooooAqpfCMbQwn/PA8rL/AIcnO3hVtqD6Y8OM2GIWxaNhIoJIvluG21vlLW8bUBQ0nPzh9sfcpzHiPrD7c+5TUKw+UvtS+/Sqyn5y+1L/ADKAex4j637dvcp5Divr/tz7lR0U/wBZfXP/AAencWLA3cf/ANHv0BJR4k/PP259yl0xH1/2x9ymMfEYxvJ92I/m04Ti0X0h9U/82gHqz/XP2p9ylBP9c/aH3aZDjUP0jeqb+ZW443D9K/qm/mUA9E/1/wBofdrYTfX/AF292mP58g+lf2Zvfo/PsH0r+zN79AP+u+v+u/u0df8AX/Wf3aYfn7D/AEzezP79Y/4gw30zezP71APzN9b9aT3a0aX633y/hTE9IsL9MfZn96tW6Q4X6Y+zP+NAPGl+t9834Ui8nj/1qatx/C/SH1T/AI0k3G8N88+qb8aAcO3n9U9NZT4H2Zj/ABpJ+L4c/K/6tN5OIQn5X/V92gMy+b9nL71NXHh+yk96sviIj8ofr+5TeR4+9fW38ugNXX6v7J/epTgq/wBqg7I/vB/hsvfzLGmrdWea+k2/fFVh6EcGDSHEMBZOzHaxBYjtMCFGwNue57qAvVFFFAFFFFAeW+mHDDhsbiINbJIcu/kNZ4/1WWoW1dz+EXoIcZi1nWQRqYgr9nMzMrHUC4A0YC57hVW4j8HcMCB2bESFmCqqZBc+JyG346V60eJhyq3qcbwytnOgx5E0dY3zm9ZroUXRHhxjjd5cTGXUsEujHLmKg3yW1t99SeF+C/CyRiRZ8QFYtluYtVBIDaJpcC9jqOdS+Jx9SFhmcp61vnN6zWDI3zm9ZrqU/wAGuDTysROP9UQH/TrdPgzwZ/xsQf8AVHr6o6j1nGT4MzlQkb5x9ZrJkb5x9ZrrqfBXhuRmI/TW/wBy1s3wU4fTWbXTy139mo9axDwZnJIVkc5Uzse5cxPqFSGG4Hi32jkFiASxK6nuF7nY7A1e8D0fjw0rmCN3ylkLMSQLA5stk3vYf1rYsAQGv1cmc2vp2MwJGnZNtDvp42rmycbrUEdMOE0uZy2XozilvqTYX0c9x5NY8iPPTWTgeLDZQjsbX0bbz66HwrseIlsShjfKQL6INCLEXyCxse81HsWFysJO97nXXXzWy3N/DxrCPF5IvXX4G8sGOSpKvc/ycalMikqxcEEggk6EGxHrrQzN89vaNWrHcGjE6jEu6rLI4LKV+LJa+oKnN5R7jVjh+DXDF2QzYjMmXMvxd1zXK3sp3tyvXbj4vHKNvc5M3CyhLTbocwMrfOb1msZj3n1musD4NcApAfETAnQBnQMT5urBp3hvgtwkihkaVlPPOAfSMtX9ZxmXgzOOBj3n11uJG+cfWa7D/wDi3Blc6vLlF7sXsLDc3K7eNIR/Bfg3F453bW2jrcHuN00Oh9VPWsY8GZyb8pfk7e0fxrIxUn0j+03411R/gqgG8k4HiyAfelLxfBFARfrph43Q/wD0p6xiHhTObcCw8+JxEUEcrhpXC3zNoD5THXYLc+ivT3DsGsMSRJfKihQSbsbC12J3J3JrnfwfdB48NiziI8Qs6KjqvYysjtl1vchuxmF9PKrplcvFZIyaUdjbDBxWoUUUVyGwUUUUBH8akVYyzMFABGYm2p29OlUXiHF4pcJGgV2jOUdYvkFw/VlCbEf3gy8rnQbirZ0yC9QC9yFkU2BK8iNSNefhyrlUvSLDxFliECDObBjcKGZSR2b31Zr+a/hW2OFrRFW6DgM2HkxAwjyTLD1zRkuVDHEAHsrYtYEkDltYgWq+cRxxjniw0ekKLZwEMjmwvZbC4GXTTW7DTa9E/PXD2lEryRkqQQNAvZvbyYjc+Nr7ehd+lGCsxR4ULswY5GkOV3uXLFFJYaWBB8ka7CtHjk+jK8yXU6MyYV2YG+ZApJIkV7SMQoBIBa5S1hfYVrLAqGy4OUi26NEB6jIK5themeHQL/aGzdZ1kjBbh2RhlzM0Zc5h3GygWtyE5hPhNhJYvMBmJICwSuEsQAAbi9xrtv57Cjw5F0f1J549y0YjjvUuI2iOYqrBF7bnMWJByjTKouSA17Gx0vWcJxCKRTJNFGlw0bvoMll+Mjlc2KHMGFvAXtVJxnTRJWC9bLkQXV1hmRy12NjlUm3aW4uL9XvrW+P49w6VAHSewuSTFPmLE5mYDIRcnXUipWCXZjmROzdGYlYfGuoY3AErr5Vx2R1natp5gDSPEeF4fDRF555FF7AmSXMdFOyyWvc207wNzTFDiZHZjNhbkE5erQ5gB8WbsCTci1y1ttKrXwjdb1ULSTK984CouUJ1aJlOjG5s/wBx79OGTSV0enixylNRcizcGiw2JBeIYrIL/GEYgR6Nci/WakHu2tyqTxXRaNbN10mx3lkAILAliTJy8ORtVvweFWONI1ACoiqABYAAAaDkKoPFmxCyInXwkC4OZI+xcXt5WYa5Rbz1aqWpgpuUvZdLzKx0/wCGCMQMrsRI5tcsSLgHS7EjXnYHz09ggeJ0ZMQyOPLYMpMtyGIkN9Vza876jWoPpXi5CEV2jyxyggIoXV1u5NibjsKO/espjcNr8Yutv8Ga9ha4Fo9L2J9NdPCR5ubTsOLuMIJvuWziE/WujyPEXUWAcDe+xTY+VoNfOKfvxQxRqqzHKL6qyrYntnYX+Vz81r1UvzpB8l5Dy/8Ajy96/V7gR6T5q0xXEImUBmkspLa4ebv03jsBYLfvtyrd4n2OPmRZx0kEUarHI7Fm1zyqygHVrlctgCdTfkda2/P8UZT8mjkCAu4CxyOquyFdAidoAknyrWbTnUd0f4UrhZpBe4BiQ7KmpViObG5Ou1++9WURV4+TjW5NYlp3Z1rDFL2nqVXF4tZJEJxT5gc+WQvEzMCN1kG22naFr6WqwYVpV7aYg7kkk5hmdvJYXJIuxyjQCwAsLAtOITwsxikXMo8trXSM8szfJPiNvCmsMq4SUJI4VTmMbOwQMGQqEZibXB5n6p7634bi/ElySWvTzKTxJLmRfuiOFyRubG7MLm5KMct80d9QhzaA356mp6onowE6gGO2VmLAiwGtu7TQWFhta1S1by3MUFFFFVJCiiigI/jnDIsRF1c6B0zKxU3sSpuL23F7aUyw/AsNGLR4eFAPmxqv7hUzP5Pq/fUH0o4/DgYGnmOgsFUeU7kaIvibHXkATVlzP2UQ6Wo6iwsYOigU4tXCeMcRnxM64tp50cBDAkcbHqlZU7Ueo7JbPruwAvvYdB6F9OhipWw0iP1ilsrhDZlF/wC9AHxT6a3sCdrbVGT2JcrNYYpSx88di65RWQLbVkUVBmG1bBq1IqJ4rx3DwXSaeOJmU5c7Bb8ri/K9CUm3SK7FhoFC5hHYLtdVuSLAG4uDqtge8eeqR8IBtDhz1YXVybC2a0GGvuTqNqtWE4lCkar+csLdQBpPppawHxeg025VXOlWHhxKxqOI4TsZ/lH5SRLyUX/uzyG/qwnrHQ9LBccicrr4naFbb0VQ+Odomy2ZGuTluxUqbHKRdzoOXr5v2+EHAj/FB8xX8apmL6QRs7MuJVQSLLcWAsAeRt99aSaOXFjknqn8mRHTZLQpmQA5gSQoXMCj3uAPK0udeY0FdvDHkdOVcV6QPDihY4yNRpbN2rWDi2gGlmHqrqfBOkGHxJyQyq7KoLAchtc+mqw3ZpxNuEdNr7+RORk95qK6bSMOH4sgm/5PL57ZDf7r1MKK1nhV1ZGF1dSrDvVhYj1GtGtDji6dnPvy7JdQBZcgUW3ByDTUDQMe7bwNPsJj0e6uwVTYFwSCAUuSDyIJsNBsdO6Ii4e0bnDyG0sQADHMRLCLBJVAYDVRZu5r+F3a4FucgvoBo4AHmz15mGUcfsy3RvlhNu09CMfhIQPHHinKsRlLDNIgv2hcEBr8trHXerBwHAR5oY2vMoWZbygMSCgbYja4XemZ4exPlje+z728JNtdtql+iGHu7uDdYlaMNrZpWK9ZluTooRV33LDlUpqWWPJ3srDFyRt9FRaOEYGOGIRwxrGgLEIosoLMSbAaDUk09pLC+T6T+80rXqN3uYhRRRUAKKKKA0m8k03xEYYWYAhlsQRcEdxB3pxL5J8x/dSUmy0BU8X0FwbyLJlkUCw6tJZEiIXyRkB7IFtAuUVYcHg44lyRRrGo+SoCi/fpufGlHrejdu2TbqugVEdK/wD4sn+n/cKl6iukovhn/wBP+4UIOK8C4xxGdikOI7SxtIbrEBkSxY3yHa+1N4WxfE5QrSK7xxMwL5IgsYILaqoHMHWs9BMdHDNI0rhFbCzoCb6u6qFGnfSXRXFJGcT1jBc+BxMSX5ySKoRdO/XXauO7q2e9yqLlyxSrbQj+IYGSCVoplKOhswIPoYd6ncEbil8VweWPE/kj5et6xI7Xuud8uUZrfWGtSPD+MxzIuGx+ZoxpDiBrNh78rn+8i70O3LYAK8b4lE/FziFcGE4qCTPY2yKYsxsRfTKeXKopF+ed010f9ftDSfoy6MyPicErKSrKcSgYMDYgi2hB0phxHhksDhJVylgGU3DIynZkdSQy+IqW41goZcTPKuOwoWWaWRbjE5gryMwuBAdbHvpDjmPiZMLh4WZ0wyyDrWUpnaWQO2VTqqLsL67+k0iIzk6+ugx4xwyTDTNDLlzpbNlJI7ShhqQL6EVL9HsDj0hkxeEfq1CvexHWOkZBcohU5lUkXI7jR0rxMGK4i7rMBDIY7y5W7KiNQxy5bk6Gwt3U9l6YQR4iOSHCvbDAxwf2govVgkdqPqyO2NWvcm/hUpJPcrKU5QSq21r292v6hLG9K+JxwJN+cGIkGigR3GhOvZ1217jXdMG5aNCdyqk+cgV5w6UphjIZMKR1cqZzFYhoHI7cRuLEA7EXFtOVei+Fn4mP9Bf9orbE3bODjIpRi0q36V2EuL8IixKhZQbqbo6nLIjd6MNvNseYNQEvRrFLpHiInHLrY2VvSYzY+yKt1FTkwwnrJHJHJKKpFRg6KTuf7TiQE5xwIYy3g0rMWA/RCnxq0YXDpGmSNQqKoVVAsAO4UtWOR84qYYoQ/wBURKcpbi2G8ken95pWk4PJHmpStCgUUUUAUUUUBrJsfMaRfyRS5pD5AoBCStxWklbLQGTUbx0Xgceb94qSNMeKreJh/W9Aed+i/DBisTBhy+QSsFLcwApY2vzNrDxIqSgxiPKYoMFhEALWGJJL9ncSyySKFbTYZddBSeH6GcRGUrhJQRYggqCCNiDm0N+dOuL8Rx0DqMZBD1pXMrzYfDySlQbA58pvqNzc1xpUtT3pSUpey0/j+2Mek+BMTRv1EcKyJmURzdej2NmdWzNlW+gW+ljvVt4J0TCRRR4jBSSNigxkmVCTg0ZbRZdNXv2mHKqVieOTySJLLJ1jRkZAwXq1sbgCMAKBcDQDW1NOIYlp5XllOZ5GLMxG5P7h4cqJpOyXCcoqN18x7jcHJgsS0cscbvGWGWRc0bgghXy31BBDDXQ25ip6PFRnhzYn8jwfWjGCH+57OQw5/Jzb353qt47ickqxJIQRCgjjNhmCDZS27Acr7cqF4lIIDh7jqjJ1pFhfrAuXNm38nS21E6JcHJK9yX6KBMTxGBZYYcjllaJUCxkCJyOyb63AN++l8XKiK7A8JfLeyLA+drchmUC/pqvcOx8kEqzRNlkS5VrA2JUqdDodCamuEzYzFMy4fDYeVlGZgMNhAQL2ucyDnUp6UVyQalzXpX5K3i5M2drKMxY2UWUXubKOQGwFem+Dn4iP9Bf3CuD4/odxJ2ZmwZBbkvUqo0toqtZRpsK7XE7pho8ou4UgJmyZmWJyEzcrsoF60xJq7OHj5xcY0++2vYmaKiuj2JlkjDTJ1chUFo8+fKc0gGtza4Cm1StbnnJ2rCsfJ9NDUMOwKEiuEv1aZt8q323sL7aUtWsew8wragCiiigCiiigCm6+RTim6+RQCL1lNqw9CUBsabYvEJGjSSGyICzNYkKoFyTYbAa05NMON4IzYeaEEAyxSRgnYZ0K3Pfa97UJVXqKpxCKztnsIxmkzAoUXLmuwYAgWBN/Co7jfBsHiSkmIiWQlbRtZnJXVuyF3G5vRBwiQSM2cBH6nOgZm1iznOrMDqSYxlsBaPnm0Tj6P/ELA+R0idzD2nR407XVZJEAZHRTluN10qu5dUnaZFJ0N4bIzJGkYZVRyMh0R75G7W6nK2o7jTM9CcAYhOHQRMFIcxgKQxAU9rkSRY+NTsmBUYiLPiY+tCLGwLDrcRF1YzK6cruitcA6FxzpTB8CIw0OFlKskcJiexIz9jqxoQdMpa48fCnL5F/Ef8n8yu4voTgYT8Y3NB/cFhd2yICUUgEtoBzpxB0R4fnWPqwXZXdVaFlJVGCudQLWLKLHXUVOYjhkz4WKF5FaRHw7NIb2fqJUkuRbymyAHzk+FOZ8ExxMc9xZIZYiutyZHia483VAf6vDWK8h4j/k+vUr2J6P8LiJWTDxgqhkN43sEBsWLAWABOpvpzqU4ThcFhnk6iFInGRJCquCc9iijTt30tlvWvGuDGdy2fKDA0Y3uGLq4LLs6dkAodGBIpOXhErOZc6K4lhlTRiuZI2jZWGhKsrtY8rg62pVPYc1qnJk0/FIlHaYjtrHbI5OdrZQQFuL3FjtrTuJ1ZbgG2u6lToSDdWAI1HdUZxHASTIgOQFZopCLtbLG2bLmAuSTzsLX275HBRFUVTYW0ABJAHIXbU2FtTvVjJpUKhQNhWaKKkqavtW03kitX2rfE+SP65UA4TYeas0CigCiiigCiiigCm48inFNvkemgEnoSh6ym1AZNYrNYFAZpDH4oRRSSsCRGjuQouxCKWIUczpoKXooCicQOKheTEoqNCEGOkjZiY8yoARDiMq5XKC9rOpsfIuLuJOkc95CMtkx+Dw4BQhuqxAw5bN2tHHXNr4DSrIvBsONBEuUHME16sMDcER3yA31vbek8TwXDyMXeFCzMjlral0sEf9MAABtxYa1tzx6orTI/hmLxOIGIKyRI0WIlhjBjLp8XlAznMC1yb6W3ppwfpFLi8ojVI2/J4pnDMST1jSKOr7JDIDGe1bXMNubngnA8pxPXRj43EyyizmzxvayyBTqRY6G41qTxnC4ZCpeNSUBCMBlZAbXCstio0GgNtKhuOqCshMRxHFJJhoXaDNLNKkjoGaypC0qjKx7LkBb3J3uBrpO4JXCKJCC4UZyBYFrakDkL0i3DYboerW8RLR2FsrNfMwtzNzc87nvp5HVJNPYlIcR0pWiVvVSQooooDV9q3xXkjzfwrR9q2xJ7I838KAdUUUUAUUUUAUUUUAU1v2fTTqmgPZH9chQGj1ldqw9ZXagM1XOkPShYG6tAGcWzE+SlxcAgasbEG1xYMNdasEz2ViBewJt32G1cVGND4jNO1166QsToL7x3Pde/sjkK5eLzvDjcki+HE82eGFOua/fom9PN1oWrC9OZ7i4jba4KsgvY+Q1zucvI86tEPSNJIleKKV2Y26sKewbX+Ma1kWxBvzB0B2rmXH5kLkRpoMi3JORnIzLlVSBoOf3ag1auichXH4iIG8axX22YMh3Hi71ycJxksjUZLdX9vyiud8PiyRWJykrpqVb67NV2d6e7ymY4sfKzdbIkMZAyfk5u/jnM0Rv6AtKzcPlZ1Ge8NwWHWTpMLa3zhyHBO62UWNSzyEWt322rCMNf39/mr0uVHR48r0SXuX67KhwvgfEo2QvxAlf8QN8bchtAofkV53uDyNSmJlxsqAxhIGsbhwJG8qwGZSVUkAHZt+VtZVWIvbXTQ358tOVZdtPHTTT+jVVBJUm/maT4qU5KUoxv8A8r7bP42QMOCxqqWkxDO5QDq0MYXOGF3V3isLqPJKm1zY7W04hxbGYUoxw5xEL6HIPj425hsl1cbkEAdxtzsN/wCvGnMJ0qeTTRshcSua5wi12qvtt+2NuBcXixUQliJtcqykWZGG6sORFxUkKr64eWCfOoecTydti0adTELldLjrCGY6m5yi3nnkYEAgggi4I2IOxFWi3Wu5jnhFSuH+r21v4Pb7K9zaiiirGJq1Ex7A8xrJrV/JHpoB7RWBWaAKKKKAKKKKAKYQElFvvYX89hen9Q+JxvVkZlJUgajcHxFAOnrNIRYlH1RgfNv6RuKXNAZFcs6T9H/ycsHQnDk3jlscka/Ry5fIyjQMbAhV7QYm/UlraqzgpqmNU006a1TW6fkcb4fiosiRr1TFSDE5dJWJIv8AFqDqRYDS/LSr10W4cI1Z3tnkysb2vluct/EknfXa+ugqfF8MMJjsTNHGS4V3jUWC5pB5Z5kKGY5RuR4VZuAca63CrK0ap9WO7ZQpKg5R3aHLyDCuTBgx4ZOlT+L/AH3HZl4KTriHPnvrSWr12X3LFmBNidOdr6HxOwrDRqFNzYkWzczv66a4eQjUi4IOQoCVy6eV3N5x360s2K5W20I7PZ/SF/HvrrOdo0lGUXXax2Frn+rmlE5X7tO/z/vrS+UKNbsTyGw3JvsNQPVWz73Fz/GoBs57t6VhbTupo1wNACSbn0d2ta4bGjUt2bLdgwIygbnUWy6E+ipsnltaD+duyb69wGhv4HkfGkOC8UWcSZR/dSGJtQ3aCqTYrofKt6DUFxXpbEqDqss7ObBAwAAIJDPuVXTnqTyp30DwfVwMNyXLMdru2rG3dqB6KhSt6bHRLh+TC5ZFTtV/ZZKKKKucRg1hvJ9JrJrB8k+f+FAO12FZrCbDzVmgCiiigCiiigMNVb4xM6WLJeKwuw3Q88w7vGrHLsfMaamgRUpIFNmQ+Yg07HEJUHlZh46/fS+M4ArHNCxibuGqHzry9HqqJxwmjFpk0+euqHznl6bVVl1TJBek6qe3GfOpv9x/GpPCcYgk0WRb/NPZb0Bt/RVAx791RrTWuSdALnzCqObRqsSZbunGE+MjlA8pHQ+de0vrBb1VS+AdJpcM5j8qJc+RNEN3bMSXyk3B77jlTKPpX2ghZhGrjOMxKhSGXMByKkgm3K/fUfxGRQZOTBz6CL7HmDa4rJ54umenw2NNeFLX9ZepvhDjDaiWxGxXIy6fOW6nz/uqycN4ik0QmQZFIGYnRnsLKoc+bfwNcQgxvbUupdR5ShsmbwzWNuWtqmz0zmVOqgjjgTS2XM7iwt/eSEnYnUAb1WOZ3bN8noyEklj0fVvb8/Q6xNxGPMokdFcWJTMDqdVBNgdyDt3VmXFAG+p7JJsdgLWOUkE3v3fwrhLcQcsSWJJ3JJJJ7799bjHPe+d79+Zr+u96hcS+qJ/w0Htk+n/TsGJ4tkJZ3VRbsiRhFr4lmzAbcjVR4nJiJHmnMwA6vIqxMxTJkbmQM1s5FyPlN4VUcPMFObmefP108m4sTGyDY7+P9fwqHmUtztw+j/Afs6t6W10HvR2RYyCx8w8e+uxdGF/s6H5929Z0+4CuJcMJciONbyOyqg+sTufDme4Amu94LDiONI12RFUeZQB/CteHdo8303pJXuzbE4pIxmkYKLgXO1z/AOqa/nqCwJlADZstwe1lNjlFtdadYjDJILOoYXvYi4vtt6TVXwHEAMLNPiFiYQ4yaIHIEVY1xKwswvcjYsbk3POuyMbR4DZNYfjcTuqKTmYAjQ2vYkgnbSw9oeNpDkfOKjeERYc52iiylZGUkqAQw8oIfmg6aad1SXI+cfxqrroEO4th5hW1apsPMK2qCQooooAooooBOc2Vj3A/uqOfHINC1vPp++l+NuRh5bEAlGAvtdhYX9Jqs8FxYmibOjDqzlNxqLAG4tuuuh/oWUdLIJ+LGIflClTKvzhUBDw0HXl91IcVTqo8wUMxOVRcC556nkPDXkKlRT6gd8T4Bh5LlWEbfVsUPnTb1WqncT6N4izKiK/mZbMPDMQfWKd8Oxz5XMyAhADmQprmPYGXNc35EC33mpnDwK4BUg943INgbNbY2O1VyYItNNmkMri7OaR9FcfnYDBtkOoAaOwbmT2+dav0DxrKz/k8oe9hHdMuUDvzb11ROG2NZigViQhzWtfKLjUX32++udcFjWqbOhcbkRyJOhHEh/8Apye1H79KjoTxH/lH9qP366dOLtljKkglWCkMytcABvkprcXOl/NUlFw8lRdSD3G1/Tl0vV3wkO50x9L5o7JfX8nHf+BeIf8AKt7cXv1uOgvEf+WP2kP8yumcZxKwFVIJZgW0SV7KpF9IkYk6iw0/hW/C8VFKBchCbZcwMecHYosgDGnqce7J/wAzm/jH6/k5m3QbiH/L/tYP5lJy9C+I6AYbTn8bDr+v/V669isMiKWdlUDmxCi/IEnSqfxTGTDJIiMmmUFSsubrGGoOQgLcLqDbv0F6R4OD6ifpniJKlS9y/LY36G9GsXhpxI0AJuVvmU5VJsTvpcc97GurIprnXCOJtGWWVCbtmMhYWAuIz5KAaZb2qwyKjsmRkZGV2zAgrZCgJzDT5Y51bHw3hXq9e/8ARwZ+JnnlzT3LISOdNYsHh1UosUKqSGKhEClgQQxUCxNwNfCq1C0LMy5gAuXtEWBJ7r8tqdw8LzM40spUbd6g7+mteWupgTOAwcMIYRKq52Ltbmx50qZ1FxmB8xv+6qvxiD8nVXKFlLWNuWhPPTlbUiteHcSibN8YBa4OZbKNNCxPIG/q1qyheoLzA91U94B9Yreozo1iFkw0TKSVy5QW0bsEr2h36VJ1m1TokKKKKgBRRRQFc6ccTEMAFgxdvJIJuFUsdB4hfXXPI+M2YWTLcGxubizE2N7Nv42ta+4vNdP2GIxACSsBCMuhFhJmuSDa9xZRoeVVocKkJB6xWsdAy5gN9PL21OldGOUFGmVdli4bxKViUEnZcXJ3K3GrA3OttdyPA3tTbixlKKkhbPCiqPlBmYgvIqkakC5Av3bAaoYXDYkc4+W0ara1tu2Ry7qWxHCsXIbmQ3ta46sHYjv8alzhejI1IiUO4JL5yCvV5SLKxJzbEjkNAbaqSNKluGyYixXrGVzINiFUoVJzNk3OYc76AA0JwDGD/EY37+qP8f8A1Sv5ixe2nmvGP/vRzi+pOo0xuI6vFnrDIQqDKGkKqeRZb+WpYi+5Ft71OrFLGuYw5b7AZWK2vtbS22uYGw2vpUXJ0bxbMGcK7KQVJ6u622ClXFhTmbhOPdQrMCALWzR67at29Tpz76q5R7/cDXDxyLIsisoE8ipYDQdsBusI5gNZd9x3U8TjnVq0kdlzMWIIDFrotyvaFkuRYW03500XozjhtIw0sAHhAAO4C5rC9hfvpsehWLO7E6EavDpe23a8BVuaD3Y1EsJigJZJbRgkMSQvbDBiwA5tqNL7WtfnTuDCISoU3KJlDAv2u05JdB2A2a4379dq0PQzF2tmIHg8I++96Wh6J4xWDBjmF7HPBpffT0D1CpeSPcimY4zgwzxxzydeiEuIxYgtbUSIUsQLaDcZjTYYJPySeOI5lzSiOOQZjEXZiTfTKcx2FwCdqc/8IYu98zZtO11kAawvpcDa5JPfW6dFcYt8pAuLEZoBf1WqPEj3JogMXxV5zkSFUEfZZNWa5BBcum5ax152pTh3EWyTQucnZOdTockmpUXF1JyL5O9u/eaPRfGDbJsRvCb3N9de/wDea1bo5jP8rz3iva1rXz7VbxYVRFMjTP2bWADqxJBykCx0FyGvyy2uD46GawHSOaO5uEDkZetZFz5VQXAAJ2sOew50xPRjE3DHq7gg3zxnUC3N6xhejWJjYMGS67XeHTRRfz9m/nJqHPGydSXPSMzNIkmQ5WvGCAF+SdDzI1tsb6DlUZjcOQocMjZ2AIBvobZSAQb3Om5BtztcKYnhmKY3aZd72zwWuPDL4U0/Mkt7l49+7D/d8XVVKKGpeegWKBiKX1LPIoO+UuQbDfLfX/VVprlnBoXw8qyh1OXdc6qCtiCpCAA6E2BBAOu9dPw8yuqupurAEHwNZZGnK0ShSiiiqEhRRRQHGnYmSQm9zI5PZ5liTzpxET4+x/3pFojnfT/Efv8AnGnMMDfN/wB1APsM58fY/wC9SeHlbvP2f/emGGwj/MPrapSDAv8ARn1tQDhJG7z7FOoZX729g0gmEf5h9o06jwb/ADD7R/CgFVmfvb2WpQSv3n1NSYwj/MPtf9qUGFb5p9Y92gNutbv/AN9Z6xu/73/GhcK3c3rH4Vt+TN3N61/CgE+tbvHtP+NZ60/OHtP71bjDv9b1rWfyd/r+tfxoBLrvrD2296tTOfnD2296lzA/1/WvvVgwP9f9X3qAbtOfnj7RqSac/PH2rU7OHf8AzP1PxpNsLJ/mfsvxoCPkmPzx9q34Ug8x+k/bN+FPpcK/1/2VINhH7m9UNARs0x+k/bt+FM5Zj88/bH8KlJsHJ3H1Q0xmwr933RUBHyTH5x+2NW3oNKTAwJuFlYDtZrAqptfzk+uqtLh27vujq09CIysLgix61uQHyE7qAsVFFFAFFFFANvyCLfqo79+RfwrIwUX0aeyv4U4ooBIYdPmL6hW4jHcPVW1FAa5B3D1VnKO6s0UBi1FqzRQGLUWrNFAYtRas0UBi1FqzRQGLUWrNFAYtRas0UAUUUUAUUUUAUUUUB//Z",
      },
    ],
    customer: {
      name: "Gourab Mandal",
      phone: "+91-9876543210",
      address: "4518 Washington Ave. Manchester, Kentucky 39495",
      orderType: "Self Pickup",
      status: "Picked up by Customer",
      date: "May 25, 2025 – 10:00AM",
    },
    store: {
      name: "Ajit Kirana Store",
      type: "Kirana Store",
      phone: "+91-9999999999",
      address: "Mumbai, Maharashtra",
      type: "Home Delivery",
      status:"completed",

    },

    payments: {
      transectionId: "BOBPBPPPBDMMD8HD8",
      date : "May 2,2025",
      gateway: "BILDESK",
      method: "phonePay UPI",
      amount: "₹ 295.00",
      gullakcoin: "- ₹20",
      paidamount:"₹ 274",
      status:"successsful"
    },



  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-4 bg-white p-5  rounded shadow">
        {/* Back Button */}
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => navigate(-1)}>
            <BsArrowLeftCircle size={30} className="text" />
          </button>
          <h2 className="text-xl font-semibold">View Order Details</h2>
        </div>
      </div>
      <div className="bg-white p-6 rounded shadow">
        {/* Order ID */}
        <p className="text-sm text-gray-700 mb-4">
          <strong>Order Id:</strong> {order.id}
        </p>

        {/* Items List */}
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center border-b pb-3 gap-4">
              <img
                src={item.img}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="text-sm">
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600">
                  {item.weight} / Qty: {item.qty}
                </p>
                <p className="text-black font-semibold">{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Details */}
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Customer Details</h3>
          <div className="text-sm text-gray-800 space-y-2">
            <p className="flex">
              <span className="w-40 font-semibold">Order Date:</span>
              <span>{order.customer.date}</span>
            </p>
            <p className="flex">
              <span className="w-40 font-semibold">Customer Name:</span>
              <span>{order.customer.name}</span>
            </p>
            <p className="flex">
              <span className="w-40 font-semibold">Mobile Number:</span>
              <span>{order.customer.phone}</span>
            </p>
            <p className="flex">
              <span className="w-40 font-semibold">Address:</span>
              <span>{order.customer.address}</span>
            </p>
            <p className="flex">
              <span className="w-40 font-semibold">Order Type:</span>
              <span>{order.customer.orderType}</span>
            </p>
            <p className="flex">
              <span className="w-40 font-semibold">Order Status:</span>
              <span className="text-green-600 font-medium">
                {order.customer.status}
              </span>
            </p>
          </div>
        </div>

        {/* Store Details */}
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Kirana Store Details</h3>
          <div className="text-sm text-gray-800 space-y-2">
            <p className="flex">
              <span className="w-40 font-semibold">Kirana Store Name:</span>
              <span>{order.store.name}</span>
            </p>
            <p className="flex">
              <span className="w-40 font-semibold">Type:</span>
              <span>{order.store.type}</span>
            </p>
            <p className="flex">
              <span className="w-40 font-semibold">Phone:</span>
              <span>{order.store.phone}</span>
            </p>
            <p className="flex">
              <span className="w-40 font-semibold">Address:</span>
              <span>{order.store.address}</span>
            </p>

             <p className="flex">
              <span className="w-40 font-semibold">Order Type:</span>
              <span>{order.store.type}</span>
            </p>
             <p className="flex">
              <span className="w-40 font-semibold">Order Status:</span>
              <span className="text-green-600 font-medium">{order.store.status}</span>
            </p>

          </div>
        </div>  

          {/* Payment Details */}
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Payment Details</h3>
          <div className="text-sm text-gray-800 space-y-2">
            <p className="flex">
              <span className="w-40 font-semibold">Transection ID:</span>
              <span>{order.payments.transectionId}</span>
            </p>
            <p className="flex">
              <span className="w-40 font-semibold">Date:</span>
              <span>{order.payments.date}</span>
            </p>
            <p className="flex">
              <span className="w-40 font-semibold">Payment Gateway:</span>
              <span>{order.payments.gateway}</span>
            </p>
            <p className="flex">
              <span className="w-40 font-semibold">Payment Method:</span>
              <span>{order.payments.method}</span>
            </p>

             <p className="flex">
              <span className="w-40 font-semibold">shopping Amount:</span>
              <span>{order.payments.amount}</span>
            </p>
             <p className="flex">
              <span className="w-40 font-semibold">Redeemed Gullak Coin:</span>
              <span >{order.payments.gullakcoin}</span>
            </p> 
              <p className="flex">
              <span className="w-40 font-semibold">Paid Amount:</span>
              <span>{order.payments.paidamount}</span>
            </p>

             <p className="flex">
              <span className="w-40 font-semibold">Status:</span>
              <span className="text-green-600 font-medium">{order.payments.status}</span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
