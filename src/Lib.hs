{-# LANGUAGE OverloadedStrings #-}

module Lib where

import Data.List
import Data.Word
import qualified Turtle as T
import Codec.Picture
import Codec.Picture.Types
import qualified Data.ByteString.Lazy as BS

rgbToBlack :: PixelRGB8 -> [String]
rgbToBlack (PixelRGB8 a b c) | abc < 10 = format 0
                             | otherwise = format 1
                             where abc = div (a + b + c) 3
                                   format i = [show . toInteger $ i]

-- RGB to Greyscale formula http://www.tannerhelland.com/3643/grayscale-image-algorithm-vb6/
rgbToGrey' :: PixelRGB8 -> [String]
rgbToGrey' (PixelRGB8 r g b) = [show runeValue]
  where [r', g', b'] = map (fromInteger . toInteger) [r, g, b] :: [Float]
        blackRaw = r' * 0.299 + g' *  0.587 + b' * 0.114 :: Float
        blackValue = blackRaw :: Float
        blackRune = blackValue / 255 * 8 :: Float
        absBlackRune = round blackRune :: Integer
        -- Brighten by 1 layer
        runeValue | absBlackRune == 8 = 0 :: Integer 
                  | otherwise = 7 - absBlackRune :: Integer

roundToStr :: Float -> Int -> String
roundToStr value dp = show ((fromInteger $ round $ value * (10 ^ dp)) / (10.0 ^^ dp))

rgbToRgb' :: PixelRGB8 -> [String]
rgbToRgb' (PixelRGB8 r g b) = ["color(square," ++ r' ++ "," ++ g' ++ "," ++ b' ++ ")"]
  where [r', g', b'] = map ((flip roundToStr 1) . (/ 255) . fromInteger . toInteger) [r, g, b]

splitInterval :: Int -> [String] -> [[String]]
splitInterval _ [] = []
splitInterval i str | length str < i + 1 = [str]
                    | otherwise = let (h, t) = splitAt i str
                                  in  h : splitInterval i t

formatRows :: [String] -> String
formatRows str = "list(" ++ concat (intersperse "," str) ++ ")"

formatImageStr :: [[String]] -> String
formatImageStr strs = let formattedStrs = map formatRows strs
                      in  "list(" ++ concat (intersperse ",\n" formattedStrs) ++ ")"

generateFile :: String -> IO ()
generateFile str = do
  T.touch "/home/noel/projects/pic2Rune/output"
  writeFile "/home/noel/projects/pic2Rune/output" str

clean :: IO ()
clean = T.rm "/home/noel/projects/pic2Rune/output"

testInterval :: IO ()
testInterval = 
  print $ splitInterval 1 ["a", "s", "dfg12345zxcvb"]

processImage :: FilePath -> IO ()
processImage fp = do
  clean
  Right rawImg <- readImage fp
  let height = dynamicMap imageHeight rawImg
      width = dynamicMap imageWidth rawImg
      rgbImg = convertRGB8 rawImg :: Image PixelRGB8
      -- to use grayscale
      -- rawStrImg = pixelFoldMap rgbToGrey' rgbImg :: [String]
      rawStrImg = pixelFoldMap rgbToRgb' rgbImg :: [String]
      splitStrImg = splitInterval width rawStrImg :: [[String]]
      strImg = formatImageStr splitStrImg
  print $ length splitStrImg
  print . length . head $ splitStrImg
  generateFile strImg
