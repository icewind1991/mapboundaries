{
  npmlock2nix,
  nodejs_20,
  lib,
}: let
  src = lib.sources.sourceByRegex (lib.cleanSource ./.) ["package.*" "src(/.*)?" "tsconfig.json" ".*.config.js"];
in
  npmlock2nix.v2.build {
    inherit src;
    installPhase = "cp -r build $out";
    buildCommands = ["npm run build"];
    nodejs = nodejs_20;
  }
