{
  buildNpmPackage,
  importNpmLock,
  lib,
}: let
  src = lib.sources.sourceByRegex (lib.cleanSource ../.) ["package.*" "src(/.*)?" "tsconfig.json" ".*.config.js"];
in buildNpmPackage {
  pname = "mapboundaries";
  version = "0.1.0";

  inherit src;

  npmDeps = importNpmLock {
    npmRoot = src;
  };

  npmConfigHook = importNpmLock.npmConfigHook;

  installPhase = "cp -r build $out";
}
