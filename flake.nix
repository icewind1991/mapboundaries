{
  inputs = {
    nixpkgs.url = "nixpkgs/release-23.05";
    utils.url = "github:numtide/flake-utils";
    npmlock2nix = {
      url = "github:nix-community/npmlock2nix";
      flake = false;
    };
  };

  outputs = {
    self,
    nixpkgs,
    utils,
    npmlock2nix,
  }:
    utils.lib.eachDefaultSystem (system: let
      overlays = [
        (final: prev: {
          npmlock2nix = prev.callPackage npmlock2nix {};
        })
      ];
      pkgs = import nixpkgs {
        inherit system overlays;
      };
      lib = pkgs.lib;
      src = lib.sources.sourceByRegex (lib.cleanSource ./.) ["package.*" "src(/.*)?" "tsconfig.json" ".*.config.js"];
      nodeModules = pkgs.npmlock2nix.v2.node_modules {
        inherit src;
        nodejs = pkgs.nodejs_20;
      };
    in rec {
      packages = rec {
        map-boundaries = pkgs.npmlock2nix.v2.build {
          inherit src;
          installPhase = "cp -r build $out";
          buildCommands = [ "npm run build" ];
          nodejs = pkgs.nodejs_20;
        };
        node_modules = nodeModules;
        default = map-boundaries;
      };
      devShells.default = pkgs.mkShell {
        nativeBuildInputs = with pkgs; [
          nodejs_20
        ];
      };
    });
}
